/**
 * 家庭药师 - 数据同步引擎
 *
 * 极简模式：无需登录。
 * - 每个设备首次访问自动生成 family_id (UUID)，存 localStorage
 * - 所有写操作（保存药箱/成员）后自动 push 到云端
 * - 页面加载时自动 pull 最新数据
 * - 订阅 realtime，新设备/手机端扫码后自动同步
 * - 配对：另一台设备扫码拿到 family_id，输入后两设备共享同一份数据
 */

(function () {
  'use strict';

  const FAMILY_ID_KEY = 'pharmacy_family_id';
  const SYNC_STATUS_KEY = 'pharmacy_sync_status';
  const CABINET_KEY = 'family_pharmacist_cabinet';
  const MEMBERS_KEY = 'family_pharmacist_members';
  const DEBOUNCE_MS = 800;

  // ---------- family_id 管理 ----------
  function getFamilyId() {
    let id = localStorage.getItem(FAMILY_ID_KEY);
    if (!id) {
      id = (crypto.randomUUID && crypto.randomUUID()) ||
        'fam-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(FAMILY_ID_KEY, id);
      console.log('[Sync] 新设备，生成 family_id:', id);
    }
    return id;
  }

  function setFamilyId(newId) {
    newId = String(newId || '').trim();
    if (!newId) return false;
    localStorage.setItem(FAMILY_ID_KEY, newId);
    console.log('[Sync] 配对成功，family_id 更新为:', newId);
    return true;
  }

  // ---------- 状态显示 ----------
  function setSyncStatus(text, kind) {
    try {
      const el = document.getElementById('syncStatus');
      if (el) {
        el.textContent = text || '';
        el.dataset.kind = kind || '';
      }
    } catch (e) {}
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify({
      text: text || '',
      kind: kind || '',
      at: new Date().toISOString(),
    }));
  }

  // ---------- 数据读写 ----------
  function readLocalData() {
    return {
      cabinetDrugs: JSON.parse(localStorage.getItem(CABINET_KEY) || '[]'),
      familyMembers: JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]'),
      remoteSyncedAt: localStorage.getItem('pharmacy_remote_synced_at') || null,
    };
  }

  function writeLocalData(data) {
    if (!data) return;
    if (Array.isArray(data.cabinetDrugs)) {
      localStorage.setItem(CABINET_KEY, JSON.stringify(data.cabinetDrugs));
    }
    if (Array.isArray(data.familyMembers)) {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(data.familyMembers));
    }
    if (data.remoteSyncedAt) {
      localStorage.setItem('pharmacy_remote_synced_at', data.remoteSyncedAt);
    }
  }

  // ---------- 推送 ----------
  let pushTimer = null;
  function schedulePush(reason) {
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => pushToCloud(reason), DEBOUNCE_MS);
  }

  async function pushToCloud(reason) {
    const client = window.pharmacySupabase?.init();
    if (!client) {
      setSyncStatus('⚠️ 同步未配置', 'warn');
      return { success: false, reason: 'no_client' };
    }
    const familyId = getFamilyId();
    setSyncStatus('☁️ 同步中…', 'syncing');
    try {
      const local = readLocalData();
      const payload = {
        id: familyId,
        data: {
          cabinetDrugs: local.cabinetDrugs,
          familyMembers: local.familyMembers,
        },
        updated_at: new Date().toISOString(),
      };
      const { error } = await client
        .from('pharmacy_data')
        .upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      localStorage.setItem('pharmacy_remote_synced_at', payload.updated_at);
      setSyncStatus('✅ 已同步 ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), 'ok');
      console.log('[Sync] push 成功', reason || '');
      return { success: true };
    } catch (err) {
      console.error('[Sync] push 失败:', err);
      setSyncStatus('❌ 同步失败', 'error');
      return { success: false, reason: err.message };
    }
  }

  // ---------- 拉取 ----------
  async function pullFromCloud(merge) {
    const client = window.pharmacySupabase?.init();
    if (!client) return { success: false, reason: 'no_client' };
    const familyId = getFamilyId();
    try {
      const { data, error } = await client
        .from('pharmacy_data')
        .select('*')
        .eq('id', familyId)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        console.log('[Sync] 云端无数据（首次使用）');
        // 首次使用，把本地数据推上去
        return await pushToCloud('first_sync');
      }
      const remote = data.data || {};
      const local = readLocalData();
      const finalData = merge
        ? mergeData(local, remote, data.updated_at)
        : {
            cabinetDrugs: remote.cabinetDrugs || [],
            familyMembers: remote.familyMembers || [],
            remoteSyncedAt: data.updated_at,
          };
      writeLocalData(finalData);
      setSyncStatus('☁️ 已拉取 ' + new Date(data.updated_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), 'ok');
      return { success: true, data: finalData };
    } catch (err) {
      console.error('[Sync] pull 失败:', err);
      setSyncStatus('❌ 拉取失败', 'error');
      return { success: false, reason: err.message };
    }
  }

  // ---------- 合并策略（去重按 name+expiry/relationship+name） ----------
  function mergeData(local, remote, remoteUpdatedAt) {
    const mergedDrugs = mergeByKey(
      [...(local.cabinetDrugs || []), ...(remote.cabinetDrugs || [])],
      d => (d.name || '') + '|' + (d.expiry || '') + '|' + (d.spec || '')
    );
    const mergedMembers = mergeByKey(
      [...(local.familyMembers || []), ...(remote.familyMembers || [])],
      m => (m.name || '') + '|' + (m.relationship || '')
    );
    return {
      cabinetDrugs: mergedDrugs,
      familyMembers: mergedMembers,
      remoteSyncedAt: remoteUpdatedAt,
    };
  }

  function mergeByKey(arr, keyFn) {
    const map = new Map();
    for (const item of arr) {
      if (!item) continue;
      const k = keyFn(item);
      if (!k || k === '|') continue; // 跳过空记录
      if (!map.has(k)) map.set(k, item);
    }
    return Array.from(map.values());
  }

  // ---------- 自动劫持 saveCabinet / saveMembers ----------
  function hookSavers() {
    const tryHook = () => {
      const hooked = [];
      // 只在原函数本身没调 pharmacySync 时才劫持（避免双推送）
      if (typeof window.saveCabinet === 'function' && !window.saveCabinet.__hooked) {
        const src = window.saveCabinet.toString();
        if (src.indexOf('pharmacySync') === -1 && src.indexOf('pharmacy_sync') === -1) {
          const orig = window.saveCabinet;
          window.saveCabinet = function (arr) {
            const r = orig.apply(this, arguments);
            schedulePush('saveCabinet');
            return r;
          };
          window.saveCabinet.__hooked = true;
          hooked.push('saveCabinet');
        }
      }
      if (typeof window.saveMembers === 'function' && !window.saveMembers.__hooked) {
        const src = window.saveMembers.toString();
        if (src.indexOf('pharmacySync') === -1 && src.indexOf('pharmacy_sync') === -1) {
          const orig = window.saveMembers;
          window.saveMembers = function (arr) {
            const r = orig.apply(this, arguments);
            schedulePush('saveMembers');
            return r;
          };
          window.saveMembers.__hooked = true;
          hooked.push('saveMembers');
        }
      }
      if (hooked.length) console.log('[Sync] 劫持成功:', hooked.join(', '));
    };
    tryHook();
    setTimeout(tryHook, 100);
    setTimeout(tryHook, 500);
    setTimeout(tryHook, 1500);

    // 监听 localStorage 写入作为兜底（仅跨页面）
    window.addEventListener('storage', (e) => {
      if (e.key === CABINET_KEY || e.key === MEMBERS_KEY) {
        schedulePush('storage_event');
      }
    });
  }

  // ---------- Realtime 订阅 ----------
  let realtimeChannel = null;
  function subscribeRealtime() {
    const client = window.pharmacySupabase?.init();
    if (!client) return;
    if (realtimeChannel) return;
    const familyId = getFamilyId();
    realtimeChannel = client
      .channel('pharmacy-data-' + familyId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pharmacy_data',
        filter: 'id=eq.' + familyId,
      }, (payload) => {
        console.log('[Sync] 收到远端变更:', payload.eventType);
        // 收到变更时拉取最新（不带 merge，避免回环）
        pullFromCloud(false).then(() => {
          if (typeof renderCabinet === 'function') renderCabinet();
        });
      })
      .subscribe();
    console.log('[Sync] realtime 已订阅 family_id =', familyId);
  }

  // ---------- 配对（供 UI 调用） ----------
  async function pairDevice(targetFamilyId) {
    if (!setFamilyId(targetFamilyId)) {
      return { success: false, reason: 'invalid_id' };
    }
    // 重新订阅 realtime
    if (realtimeChannel) {
      const client = window.pharmacySupabase?.getClient();
      if (client) client.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
    subscribeRealtime();
    // 拉取对方数据
    return await pullFromCloud(true);
  }

  // ---------- 启动 ----------
  async function bootstrap() {
    const client = window.pharmacySupabase?.init();
    if (!client) {
      setSyncStatus('⚠️ 同步未启用', 'warn');
      return;
    }
    setSyncStatus('☁️ 连接中…', 'syncing');
    await pullFromCloud(false);
    subscribeRealtime();
  }

  // 暴露 API
  window.pharmacySync = {
    push: pushToCloud,
    pushToCloud: () => pushToCloud('manual'), // 兼容旧 cabinet.html 调用
    pull: () => pullFromCloud(true),
    pullFromCloud: () => pullFromCloud(false), // 兼容旧 auth.js 调用
    pair: pairDevice,
    getFamilyId,
    schedulePush,
  };

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      hookSavers();
      bootstrap();
    });
  } else {
    hookSavers();
    bootstrap();
  }
})();
