/**
 * 彩云智药 - 数据同步引擎
 * 负责 localStorage 和 Supabase 之间的双向同步
 */

(function() {
  'use strict';

  const SYNC_KEY = 'pharmacy_sync_status';
  const CONFLICT_RESOLUTION = 'server_wins'; // 或 'local_wins', 'merge'

  // 获取当前用户ID
  function getUserId() {
    const supabase = window.pharmacySupabase?.getClient();
    if (!supabase) return null;

    const session = supabase.auth.getSession();
    return session?.user?.id || null;
  }

  // 推送本地数据到云端
  async function pushToCloud() {
    const supabase = window.pharmacySupabase?.getClient();
    const userId = getUserId();

    if (!supabase || !userId) {
      console.warn('[Sync] 未登录，跳过推送');
      return { success: false, reason: 'not_logged_in' };
    }

    console.log('[Sync] 开始推送数据到云端...');

    try {
      // 1. 推送药箱数据
      const localDrugs = JSON.parse(localStorage.getItem('cabinetDrugs') || '[]');
      const drugsResult = await syncDrugs(supabase, userId, localDrugs);
      console.log('[Sync] 药箱同步结果:', drugsResult);

      // 2. 推送家庭成员
      const localMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
      const membersResult = await syncMembers(supabase, userId, localMembers);
      console.log('[Sync] 家庭成员同步结果:', membersResult);

      // 更新同步时间
      localStorage.setItem(SYNC_KEY, JSON.stringify({
        lastSync: new Date().toISOString(),
        direction: 'push',
        status: 'success'
      }));

      return { success: true };
    } catch (err) {
      console.error('[Sync] 推送失败:', err);
      return { success: false, reason: err.message };
    }
  }

  // 从云端拉取数据
  async function pullFromCloud() {
    const supabase = window.pharmacySupabase?.getClient();
    const userId = getUserId();

    if (!supabase || !userId) {
      console.warn('[Sync] 未登录，跳过拉取');
      return { success: false, reason: 'not_logged_in' };
    }

    console.log('[Sync] 开始从云端拉取数据...');

    try {
      // 1. 拉取药箱数据
      const { data: cloudDrugs, error: drugsError } = await supabase
        .from('cabinet_drugs')
        .select('*')
        .eq('user_id', userId);

      if (drugsError) throw drugsError;

      // 合并到本地
      const mergedDrugs = mergeDrugs(
        JSON.parse(localStorage.getItem('cabinetDrugs') || '[]'),
        cloudDrugs || []
      );
      localStorage.setItem('cabinetDrugs', JSON.stringify(mergedDrugs));

      // 2. 拉取家庭成员
      const { data: cloudMembers, error: membersError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', userId);

      if (membersError) throw membersError;

      const mergedMembers = mergeMembers(
        JSON.parse(localStorage.getItem('familyMembers') || '[]'),
        cloudMembers || []
      );
      localStorage.setItem('familyMembers', JSON.stringify(mergedMembers));

      // 更新同步时间
      localStorage.setItem(SYNC_KEY, JSON.stringify({
        lastSync: new Date().toISOString(),
        direction: 'pull',
        status: 'success'
      }));

      // 触发UI刷新
      if (typeof renderCabinet === 'function') {
        renderCabinet();
      }

      console.log('[Sync] 拉取完成');
      return { success: true };
    } catch (err) {
      console.error('[Sync] 拉取失败:', err);
      return { success: false, reason: err.message };
    }
  }

  // 同步药箱数据到云端
  async function syncDrugs(supabase, userId, localDrugs) {
    // 先清空云端数据，再插入（简化逻辑）
    await supabase.from('cabinet_drugs').delete().eq('user_id', userId);

    if (localDrugs.length === 0) return { inserted: 0 };

    const records = localDrugs.map(drug => ({
      user_id: userId,
      drug_name: drug.name,
      generic_name: drug.genericName || null,
      category: drug.category || null,
      quantity: drug.quantity || 1,
      unit: drug.unit || '盒',
      expiry_date: drug.expiry || null,
      purchase_date: drug.purchaseDate || null,
      location: drug.location || null,
      notes: drug.notes || null,
      reminder_enabled: drug.reminder || false,
    }));

    const { error } = await supabase.from('cabinet_drugs').insert(records);
    if (error) throw error;

    return { inserted: records.length };
  }

  // 同步家庭成员到云端
  async function syncMembers(supabase, userId, localMembers) {
    await supabase.from('family_members').delete().eq('user_id', userId);

    if (localMembers.length === 0) return { inserted: 0 };

    const records = localMembers.map(member => ({
      user_id: userId,
      name: member.name,
      relationship: member.relationship || null,
      birth_date: member.birthDate || null,
      notes: member.notes || null,
    }));

    const { error } = await supabase.from('family_members').insert(records);
    if (error) throw error;

    return { inserted: records.length };
  }

  // 合并药箱数据（以服务器为准）
  function mergeDrugs(localDrugs, cloudDrugs) {
    // 简化：云端数据优先
    if (cloudDrugs && cloudDrugs.length > 0) {
      return cloudDrugs.map(d => ({
        id: d.id,
        name: d.drug_name,
        genericName: d.generic_name,
        category: d.category,
        quantity: d.quantity,
        unit: d.unit,
        expiry: d.expiry_date,
        purchaseDate: d.purchase_date,
        location: d.location,
        notes: d.notes,
        reminder: d.reminder_enabled,
      }));
    }
    return localDrugs;
  }

  // 合并家庭成员数据
  function mergeMembers(localMembers, cloudMembers) {
    if (cloudMembers && cloudMembers.length > 0) {
      return cloudMembers.map(m => ({
        id: m.id,
        name: m.name,
        relationship: m.relationship,
        birthDate: m.birth_date,
        notes: m.notes,
      }));
    }
    return localMembers;
  }

  // 自动同步（页面加载时）
  async function autoSync() {
    const loggedIn = await window.pharmacySupabase?.isLoggedIn();
    if (loggedIn) {
      console.log('[Sync] 检测到已登录，开始自动同步');
      await pullFromCloud();
    }
  }

  // 订阅实时变更（WebSocket）
  function subscribeChanges() {
    const supabase = window.pharmacySupabase?.getClient();
    if (!supabase) return;

    // 订阅药箱变更
    supabase
      .channel('cabinet_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'cabinet_drugs',
      }, (payload) => {
        console.log('[Sync] 收到药箱变更:', payload);
        pullFromCloud(); // 自动拉取最新数据
      })
      .subscribe();
  }

  // 导出
  window.pharmacySync = {
    pushToCloud,
    pullFromCloud,
    autoSync,
    subscribeChanges,
  };

  // 页面加载后自动同步
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoSync);
  } else {
    autoSync();
  }

})();
