/* ============================================================
 * syncengine.js — 家庭药师 · 多设备云端同步引擎 v1.0
 * ------------------------------------------------------------
 * 用途：
 *   通过配套 Cloudflare Worker（worker/ai-worker.js + KV）实现
 *   家庭药箱 / 家庭成员 / 服药提醒 的多设备同步。
 *   家庭 ID 即配对密钥（12 位随机码），谁持有 ID 谁可读写该家庭数据。
 *
 * 数据全部只读/写本机 localStorage 与 Cloudflare KV，不经过第三方。
 * 冲突策略：按时间戳「最后写入生效」(last-write-wins)。
 * ============================================================ */
(function (global) {
  'use strict';

  var LS = {
    familyId: 'family_pharmacist_sync_family_id',
    deviceId: 'family_pharmacist_sync_device_id',
    deviceName: 'family_pharmacist_sync_device_name',
    workerUrl: 'family_pharmacist_worker_url', // 与 AI 代理地址共用
    meta: 'family_pharmacist_sync_meta',
    queue: 'family_pharmacist_sync_queue',
    lastSync: 'family_pharmacist_sync_last',
    session: 'family_pharmacist_session', // v5.8 账号会话令牌
    user: 'family_pharmacist_user'        // v5.8 当前用户信息
  };

  // 同步类型 → 本地存储键
  var TYPES = {
    cabinet: 'family_pharmacist_cabinet',
    members: 'family_pharmacist_members',
    reminders: 'medication_reminders'
  };
  var TYPE_ORDER = ['cabinet', 'members', 'reminders'];

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  var CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function genCode(len) {
    var arr = new Uint8Array(len);
    var cr = global.crypto || global.msCrypto;
    if (cr && cr.getRandomValues) cr.getRandomValues(arr);
    else { for (var i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 256); }
    var s = '';
    for (var j = 0; j < len; j++) s += CHARS[arr[j] % CHARS.length];
    return s;
  }

  function getDeviceId() {
    var d = lsGet(LS.deviceId);
    if (!d) { d = genCode(10); lsSet(LS.deviceId, d); }
    return d;
  }
  function getDeviceName() {
    var n = lsGet(LS.deviceName);
    if (!n) {
      n = '设备-' + getDeviceId().slice(-4);
      lsSet(LS.deviceName, n);
    }
    return n;
  }
  function getWorkerUrl() {
    var u = (lsGet(LS.workerUrl) || '').trim();
    return u ? u.replace(/\/+$/, '') : '';
  }
  function getFamilyId() { return (lsGet(LS.familyId) || '').trim(); }

  function readMeta() {
    try { return JSON.parse(lsGet(LS.meta) || '{}'); } catch (e) { return {}; }
  }
  function writeMeta(m) { lsSet(LS.meta, JSON.stringify(m)); }

  function readQueue() {
    try { return JSON.parse(lsGet(LS.queue) || '[]'); } catch (e) { return []; }
  }
  function writeQueue(q) { lsSet(LS.queue, JSON.stringify(q)); }

  function api(method, path, body, timeoutMs) {
    var url = getWorkerUrl();
    if (!url) return Promise.reject(new Error('未配置代理地址'));
    var headers = { 'Content-Type': 'application/json' };
    var token = lsGet(LS.session);
    if (token) headers['Authorization'] = 'Bearer ' + token;
    var opt = { method: method, headers: headers };
    if (body) opt.body = JSON.stringify(body);
    var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    if (ctrl) opt.signal = ctrl.signal;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs || 12000) : null;
    return fetch(url + path, opt).then(function (r) {
      if (timer) clearTimeout(timer);
      return r.json().then(function (d) {
        if (!r.ok) throw new Error((d && d.error) || ('HTTP ' + r.status));
        return d;
      });
    }).catch(function (e) {
      if (timer) clearTimeout(timer);
      throw e;
    });
  }

  /* ---------- v5.8 账号体系 ---------- */
  function getSession() { return (lsGet(LS.session) || '').trim(); }
  function getUser() {
    try { return JSON.parse(lsGet(LS.user) || 'null'); } catch (e) { return null; }
  }
  function setSession(token, user) {
    lsSet(LS.session, token || '');
    lsSet(LS.user, JSON.stringify(user || null));
  }
  function clearSession() {
    lsDel(LS.session);
    lsDel(LS.user);
  }
  function isLoggedIn() { return !!getSession(); }

  function accountRegister(email, password, name, securityQ, securityA) {
    return api('POST', '/auth/register', { email: email, password: password, name: name, securityQ: securityQ, securityA: securityA })
      .then(function (d) {
        if (!d.ok) throw new Error(d.error || '注册失败');
        setSession(d.token, d.user);
        return d;
      });
  }
  function accountLogin(email, password) {
    return api('POST', '/auth/login', { email: email, password: password }).then(function (d) {
      if (!d.ok) throw new Error(d.error || '登录失败');
      setSession(d.token, d.user);
      return d;
    });
  }
  function accountLogout() {
    var t = getSession();
    clearSession();
    if (t) { api('POST', '/auth/logout').catch(function () {}); }
    return Promise.resolve({ ok: true });
  }
  function accountMe() {
    return api('GET', '/auth/me').then(function (d) {
      if (!d.ok) throw new Error(d.error || '会话已失效');
      setSession(getSession(), d.user);
      return d;
    });
  }
  function accountChangePassword(oldPassword, newPassword) {
    return api('POST', '/auth/change-password', { oldPassword: oldPassword, newPassword: newPassword });
  }
  function accountResetPassword(email, answer, newPassword) {
    return api('POST', '/auth/reset', { email: email, answer: answer, newPassword: newPassword });
  }
  // v6.6 注销账号：删除云端账号与全部数据，并清除本机登录状态
  function accountDelete() {
    var t = getSession();
    return api('POST', '/auth/delete').then(function (d) {
      if (!d.ok) throw new Error(d.error || '注销失败');
      clearSession();
      return d;
    }).catch(function (e) {
      if (t) clearSession();
      throw e;
    });
  }

  /* ---------- v5.8 用药记录 / 健康档案 / 公告 ---------- */
  function logsAdd(drug, dose, takenAt, note) {
    return api('POST', '/logs/add', { drug: drug, dose: dose, takenAt: takenAt, note: note });
  }
  function logsList(limit) {
    return api('GET', '/logs/list?limit=' + (limit || 200)).then(function (d) { return d.logs || []; });
  }
  function logsDelete(id) {
    return api('POST', '/logs/delete', { id: id });
  }
  function healthAdd(rtype, value, unit, recordedAt, note) {
    return api('POST', '/health/add', { rtype: rtype, value: value, unit: unit, recordedAt: recordedAt, note: note });
  }
  function healthList(rtype, limit) {
    return api('GET', '/health/list' + (rtype ? ('?rtype=' + encodeURIComponent(rtype) + '&limit=' + (limit || 300)) : ('?limit=' + (limit || 300))))
      .then(function (d) { return (d && d.records) || []; });
  }
  function healthDelete(id) {
    return api('POST', '/health/delete', { id: id });
  }
  function announcements() {
    return api('GET', '/announcements').then(function (d) { return d.announcements || []; });
  }

  /* ---------- 家庭配对 ---------- */
  function createFamily(familyName) {
    var body = { deviceId: getDeviceId(), deviceName: getDeviceName(), familyName: familyName || ('我的家庭-' + getDeviceId().slice(-4)) };
    return api('POST', '/sync/create', body).then(function (d) {
      if (!d.ok || !d.familyId) throw new Error(d.error || '创建失败');
      lsSet(LS.familyId, d.familyId);
      return d;
    });
  }

  function joinFamily(code) {
    code = String(code || '').trim().toUpperCase();
    if (code.length < 4) return Promise.reject(new Error('请输入有效的家庭 ID'));
    var body = { familyId: code, deviceId: getDeviceId(), deviceName: getDeviceName() };
    return api('POST', '/sync/join', body).then(function (d) {
      if (!d.ok) throw new Error(d.error || '加入失败');
      lsSet(LS.familyId, code);
      return d;
    });
  }

  function leaveFamily() {
    var fid = getFamilyId();
    if (!fid) return Promise.resolve({ ok: true });
    return api('POST', '/sync/leave', { familyId: fid, deviceId: getDeviceId() }).catch(function () {
      return { ok: true, offline: true };
    }).then(function () {
      lsDel(LS.familyId);
      writeMeta({});
      writeQueue([]);
      return { ok: true };
    });
  }

  /* ---------- 数据读写 ---------- */
  function put(type, dataStr) {
    var fid = getFamilyId();
    if (!fid) return Promise.resolve({ skipped: true, reason: 'no-family' });
    var ts = Date.now();
    var body = { familyId: fid, deviceId: getDeviceId(), type: type, data: JSON.parse(dataStr), ts: ts };
    return api('POST', '/sync/put', body).then(function (d) {
      if (!d.ok) throw new Error(d.error || '上传失败');
      var m = readMeta();
      m[type] = m[type] || {};
      m[type].updatedAt = ts;
      writeMeta(m);
      return d;
    });
  }

  function pull(type) {
    var fid = getFamilyId();
    if (!fid) return Promise.resolve({ skipped: true, reason: 'no-family' });
    // 加 _t 防浏览器缓存旧响应
    return api('GET', '/sync/get?familyId=' + encodeURIComponent(fid) + '&type=' + encodeURIComponent(type) + '&_t=' + Date.now())
      .then(function (d) {
        if (!d.ok) throw new Error(d.error || '下载失败');
        return d;
      });
  }

  /* ---------- 变更记录（离线队列） ---------- */
  function noteLocalChange(type, dataStr) {
    var m = readMeta();
    m[type] = m[type] || {};
    m[type].updatedAt = Date.now();
    m[type].dirty = true;
    writeMeta(m);
    var q = readQueue();
    q.push({ type: type, data: JSON.parse(dataStr), ts: m[type].updatedAt });
    if (q.length > 50) q = q.slice(-50);
    writeQueue(q);
  }

  function flushQueue() {
    var q = readQueue();
    if (!q.length) return Promise.resolve();
    var chain = Promise.resolve();
    q.forEach(function (item) {
      chain = chain.then(function () {
        var fid = getFamilyId();
        if (!fid) return;
        return put(item.type, JSON.stringify(item.data)).catch(function () {});
      });
    });
    return chain.then(function () { writeQueue([]); });
  }

  /* ---------- v5.8 账号级全量同步 ---------- */
  function accountSyncAll(onProgress) {
    var prog = onProgress || function () {};
    return flushQueue().then(function () {
      var chain = Promise.resolve();
      var stats = { pulled: 0, pushed: 0, unchanged: 0 };
      TYPE_ORDER.forEach(function (type) {
        chain = chain.then(function () {
          return api('GET', '/sync/account/get?type=' + encodeURIComponent(type) + '&_t=' + Date.now()).then(function (remote) {
            var key = TYPES[type];
            var localStr = lsGet(key);
            var meta = readMeta();
            var localTs = (meta[type] && meta[type].updatedAt) || 0;
            var remoteTs = (remote && remote.ts) || 0;
            var remoteData = remote && remote.data;
            if (remoteData != null && remoteTs > localTs && (!localStr || remoteTs > localTs)) {
              lsSet(key, JSON.stringify(remoteData));
              meta[type] = { updatedAt: remoteTs };
              writeMeta(meta);
              stats.pulled++;
            } else if (localStr && localTs > remoteTs) {
              return api('POST', '/sync/account/put', { type: type, data: JSON.parse(localStr), ts: localTs }).then(function () { stats.pushed++; });
            } else {
              stats.unchanged++;
            }
            prog(type, 'ok');
          }).catch(function (e) {
            prog(type, 'error', e && e.message);
          });
        });
      });
      return chain.then(function () {
        lsSet(LS.lastSync, String(Date.now()));
        stats.status = 'ok';
        stats.mode = 'account';
        return stats;
      });
    });
  }

  /* ---------- 全量同步 ---------- */
  function syncAll(onProgress) {
    var prog = onProgress || function () {};
    if (!getWorkerUrl()) return Promise.resolve({ status: 'no-worker-url' });
    if (isLoggedIn()) return accountSyncAll(onProgress);
    var fid = getFamilyId();
    if (!fid) return Promise.resolve({ status: 'unconfigured' });
    return flushQueue().then(function () {
      var chain = Promise.resolve();
      var stats = { pulled: 0, pushed: 0, unchanged: 0 };
      TYPE_ORDER.forEach(function (type) {
        chain = chain.then(function () {
          return pull(type).then(function (remote) {
            var key = TYPES[type];
            var localStr = lsGet(key);
            var meta = readMeta();
            var localTs = (meta[type] && meta[type].updatedAt) || 0;
            var remoteTs = (remote && remote.ts) || 0;
            var remoteData = remote && remote.data;
            if (remoteData != null && remoteTs > localTs && (!localStr || remoteTs > localTs)) {
              lsSet(key, JSON.stringify(remoteData));
              meta[type] = { updatedAt: remoteTs };
              writeMeta(meta);
              stats.pulled++;
            } else if (localStr && localTs > remoteTs) {
              return put(type, localStr).then(function () { stats.pushed++; });
            } else {
              stats.unchanged++;
            }
            prog(type, 'ok');
          }).catch(function (e) {
            prog(type, 'error', e && e.message);
          });
        });
      });
      return chain.then(function () {
        lsSet(LS.lastSync, String(Date.now()));
        stats.status = 'ok';
        stats.familyId = fid;
        return stats;
      });
    });
  }

  /* ---------- 联网自动同步 ---------- */
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('online', function () {
      if (getWorkerUrl() && (getFamilyId() || isLoggedIn())) syncAll();
    });
  }

  global.PharmacySync = {
    version: '1.1.0',
    TYPES: TYPES,
    getFamilyId: getFamilyId,
    getDeviceId: getDeviceId,
    getDeviceName: getDeviceName,
    getWorkerUrl: getWorkerUrl,
    createFamily: createFamily,
    joinFamily: joinFamily,
    leaveFamily: leaveFamily,
    put: put,
    pull: pull,
    syncAll: syncAll,
    flushQueue: flushQueue,
    noteLocalChange: noteLocalChange,
    hasConfig: function () { return !!getWorkerUrl() && (!!getFamilyId() || isLoggedIn()); },
    getLastSync: function () { return lsGet(LS.lastSync) || ''; },
    // v5.8 账号体系
    getSession: getSession,
    getUser: getUser,
    setSession: setSession,
    isLoggedIn: isLoggedIn,
    register: accountRegister,
    login: accountLogin,
    logout: accountLogout,
    me: accountMe,
    changePassword: accountChangePassword,
    resetPassword: accountResetPassword,
    deleteAccount: accountDelete,
    logsAdd: logsAdd,
    logsList: logsList,
    logsDelete: logsDelete,
    healthAdd: healthAdd,
    healthList: healthList,
    healthDelete: healthDelete,
    announcements: announcements,
    _ls: LS
  };
})(typeof window !== 'undefined' ? window : this);
