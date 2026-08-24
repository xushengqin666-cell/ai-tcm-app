/* ============================================================
 * ai-worker.js — 家庭药师 服务端代理（Cloudflare Worker）v2
 * ------------------------------------------------------------
 * 功能：
 *   1) AI 问答代理（/chat，兼容旧 POST /）
 *      通道优先级：SiliconFlow → 阿里云百炼 → pollinations.ai（免密钥兜底）
 *      密钥仅保存在 Worker 环境变量，前端不接触。
 *   2) 多设备云端同步（/sync/*，需绑定 KV 命名空间 PHARMACY_KV）
 *      家庭药箱 / 家庭成员 / 服药提醒 按「家庭 ID」配对同步。
 *      家庭 ID 即配对密钥（12 位随机码），谁持有谁可读写。
 *   3) 健康检查 /health
 *
 * 部署（wrangler.toml 已配置，或手动在控制台操作）：
 *   变量：SILICONFLOW_KEY（可选）、DASHSCOPE_KEY（可选）、AUTH_TOKEN（可选）
 *   KV  ：创建命名空间后绑定为 PHARMACY_KV（同步功能必需）
 *
 * 请求协议：
 *   POST /chat  { message, think?, token? }
 *   POST /sync/create { deviceId?, deviceName?, familyName? }
 *   POST /sync/join   { familyId, deviceId?, deviceName? }
 *   POST /sync/put    { familyId, deviceId?, type, data, ts? }
 *   GET  /sync/get?familyId=..&type=..        （或 POST /sync/get）
 *   GET  /sync/meta?familyId=..               （或 POST /sync/meta）
 *   POST /sync/leave  { familyId, deviceId? }
 * ============================================================ */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store'
};

const SYNC_TYPES = ['cabinet', 'members', 'reminders'];
const MAX_DATA_BYTES = 1024 * 1024; // 单类型数据 ≤ 1MB

/* ---- 简单内存限流：同 IP 每分钟 ≤ 120 次（WAF 仍是主防线） ---- */
const rateMap = new Map();
function rateLimit(ip, limit = 120) {
  const now = Date.now();
  const win = 60 * 1000;
  let rec = rateMap.get(ip);
  if (!rec || now - rec.windowStart > win) {
    rec = { windowStart: now, count: 0 };
    rateMap.set(ip, rec);
  }
  rec.count++;
  if (rateMap.size > 5000) {
    // 清理过期条目，防止内存膨胀
    for (const [k, v] of rateMap) if (now - v.windowStart > win) rateMap.delete(k);
  }
  return rec.count > limit;
}

function json(obj, status, extraHeaders) {
  const headers = Object.assign({}, CORS, extraHeaders || {});
  return new Response(JSON.stringify(obj), { status, headers });
}

function checkAuth(request, env, body) {
  // 若部署时设置了 AUTH_TOKEN，则要求请求携带相同令牌（body.token 或 x-auth-token）
  if (!env.AUTH_TOKEN) return true;
  const fromBody = (body && body.token) || '';
  const fromHeader = request.headers.get('x-auth-token') || '';
  return fromBody === env.AUTH_TOKEN || fromHeader === env.AUTH_TOKEN;
}

function genCode(len) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  let s = '';
  for (let i = 0; i < len; i++) s += chars[arr[i] % chars.length];
  return s;
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS, status: 204 });

    const ip = (request.headers.get('cf-connecting-ip') || 'unknown');
    if (rateLimit(ip, 300)) return json({ error: 'too many requests' }, 429);

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (path === '/health') {
      return json({
        ok: true,
        hasKV: !!env.PHARMACY_KV,
        hasD1: !!env.pharmacy_db,
        providers: {
          siliconflow: !!env.SILICONFLOW_KEY,
          dashscope: !!env.DASHSCOPE_KEY,
          pollinations: true
        },
        syncTypes: SYNC_TYPES
      }, 200);
    }

    if (path === '/' || path === '/chat') return handleChat(request, env, ctx);

    // ===== 账号体系（D1）=====
    if (path === '/auth/register') return handleRegister(request, env);
    if (path === '/auth/login') return handleLogin(request, env);
    if (path === '/auth/logout') return handleLogout(request, env);
    if (path === '/auth/me') return handleMe(request, env);
    if (path === '/auth/change-password') return handleChangePassword(request, env);
    if (path === '/auth/reset') return handleResetPassword(request, env);

    // ===== 账号级数据同步（D1）=====
    if (path === '/sync/account/put') return accountSyncPut(request, env);
    if (path === '/sync/account/get') return accountSyncGet(request, env);
    if (path === '/sync/account/all') return accountSyncAll(request, env);

    // ===== 用药记录 / 健康档案（D1）=====
    if (path === '/logs/add') return logsAdd(request, env);
    if (path === '/logs/list') return logsList(request, env);
    if (path === '/logs/delete') return logsDelete(request, env);
    if (path === '/health/add') return healthAdd(request, env);
    if (path === '/health/list') return healthList(request, env);
    if (path === '/health/delete') return healthDelete(request, env);

    // ===== 公告 =====
    if (path === '/announcements') return announcementsList(request, env);

    // ===== 管理后台（需管理员）=====
    if (path === '/admin/users') return adminUsers(request, env);
    if (path === '/admin/stats') return adminStats(request, env);
    if (path === '/admin/announcement') return adminAnnouncement(request, env);

    // ===== v6.4 AI 系统中枢：反馈 / 埋点 / 自主数据更新 =====
    if (path === '/feedback/submit') return feedbackSubmit(request, env);
    if (path === '/track/search') return trackSearch(request, env);
    if (path === '/track/ai-rating') return trackAiRating(request, env);
    if (path === '/drug/ai-entries') return aiDrugEntriesList(request, env);
    if (path === '/ops/overview') return opsOverview(request, env);
    if (path === '/ops/ai-report') return opsAiReport(request, env);
    if (path === '/ops/ai-draft') return opsAiDraft(request, env);
    if (path === '/ops/ai-draft-review') return opsAiDraftReview(request, env);

    if (path.startsWith('/sync')) return handleSync(request, env, ctx, path);
    return json({ error: 'not found' }, 404);
  }
};

/* ================= AI 问答 ================= */
async function handleChat(request, env) {
  if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405);
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
  if (!checkAuth(request, env, body)) return json({ error: 'unauthorized' }, 401);

  const message = String(body.message || '').trim().slice(0, 2000);
  if (!message) return json({ error: 'empty message' }, 400);
  const think = !!body.think;

  const attempts = [];
  if (env.SILICONFLOW_KEY) attempts.push(['siliconflow', () => callSiliconFlow(env, message, think)]);
  if (env.DASHSCOPE_KEY) attempts.push(['dashscope', () => callDashScope(env, message, think)]);
  attempts.push(['pollinations', () => callPollinations(message, think)]);

  let lastErr = '';
  for (const [name, fn] of attempts) {
    try {
      const data = await fn();
      return json(data, 200);
    } catch (e) {
      lastErr = name + ': ' + e.message;
      console.error('[worker]', lastErr);
    }
  }
  return json({ error: 'all providers failed: ' + lastErr }, 502);
}

const SYS_PROMPT = '你是执业药师助理，为用户提供药品使用与健康咨询建议。回答要求：1. 使用规范、专业、客观的中文，不使用表情符号；2. 条理清晰，分点作答，先给结论再作解释；3. 涉及处方药注明「请在医生指导下使用」，出现急重症症状时提醒及时就医；4. 不确定的信息明确说明，不虚构剂量与适应症。';

async function callSiliconFlow(env, message, think) {
  const model = think ? 'deepseek-ai/DeepSeek-R1' : 'deepseek-ai/DeepSeek-V3';
  const resp = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + env.SILICONFLOW_KEY },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYS_PROMPT }, { role: 'user', content: message }],
      temperature: 0.3,
      max_tokens: think ? 4000 : 2000,
      stream: false
    })
  });
  if (!resp.ok) throw new Error('SiliconFlow HTTP ' + resp.status);
  const data = await resp.json();
  if (data.error) throw new Error((data.error && data.error.message) || 'SiliconFlow error');
  return data;
}

async function callDashScope(env, message, think) {
  const model = think ? 'qwen-plus' : 'qwen-turbo';
  const resp = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + env.DASHSCOPE_KEY },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYS_PROMPT }, { role: 'user', content: message }],
      max_tokens: 2048,
      temperature: 0.7,
      stream: false
    })
  });
  if (!resp.ok) throw new Error('DashScope HTTP ' + resp.status);
  const data = await resp.json();
  if (data.error) throw new Error((data.error && data.error.message) || 'DashScope error');
  return data;
}

/* 免密钥兜底通道（pollinations.ai，免费但速度与稳定性一般，仅作为最后兜底；429 时重试） */
async function callPollinations(message, think) {
  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          messages: [{ role: 'system', content: SYS_PROMPT }, { role: 'user', content: message }],
          temperature: 0.3,
          max_tokens: 1500
        })
      });
      if (!resp.ok) throw new Error('Pollinations HTTP ' + resp.status);
      const data = await resp.json();
      if (data.error) throw new Error((data.error && data.error.message) || 'Pollinations error');
      return data;
    } catch (e) {
      lastErr = e;
      await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
    }
  }
  throw lastErr || new Error('Pollinations failed');
}

/* ================= 云端同步 ================= */
async function handleSync(request, env, ctx, path) {
  if (!env.PHARMACY_KV) {
    return json({ ok: false, error: 'sync disabled: KV namespace PHARMACY_KV not bound' }, 501);
  }
  if (path === '/sync/create') return syncCreate(request, env);
  if (path === '/sync/join') return syncJoin(request, env);
  if (path === '/sync/put') return syncPut(request, env);
  if (path === '/sync/get') return syncGet(request, env);
  if (path === '/sync/meta') return syncMeta(request, env);
  if (path === '/sync/leave') return syncLeave(request, env);
  return json({ ok: false, error: 'unknown sync endpoint' }, 404);
}

async function readBody(request) {
  try { return await request.json(); } catch (e) { return null; }
}

function validateFamilyId(id) {
  id = String(id || '').trim().toUpperCase();
  return /^[A-Z2-9]{6,24}$/.test(id) ? id : null;
}

async function syncCreate(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);

  const familyId = genCode(12);
  const deviceId = String(body.deviceId || '').slice(0, 64) || genCode(10);
  const meta = {
    familyId,
    familyName: String(body.familyName || '我的家庭').slice(0, 40),
    createdAt: Date.now(),
    devices: { [deviceId]: { name: String(body.deviceName || '设备').slice(0, 40), lastSeen: Date.now() } }
  };
  await env.PHARMACY_KV.put('meta:' + familyId, JSON.stringify(meta));
  return json({ ok: true, familyId, deviceId, familyName: meta.familyName });
}

async function syncJoin(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const familyId = validateFamilyId(body.familyId);
  if (!familyId) return json({ ok: false, error: 'invalid family id' }, 400);

  const raw = await env.PHARMACY_KV.get('meta:' + familyId);
  if (!raw) return json({ ok: false, error: 'family not found' }, 404);
  const meta = JSON.parse(raw);
  const deviceId = String(body.deviceId || '').slice(0, 64) || genCode(10);
  meta.devices = meta.devices || {};
  meta.devices[deviceId] = { name: String(body.deviceName || '设备').slice(0, 40), lastSeen: Date.now() };
  await env.PHARMACY_KV.put('meta:' + familyId, JSON.stringify(meta));
  return json({ ok: true, familyId, familyName: meta.familyName, devices: meta.devices });
}

async function syncPut(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const familyId = validateFamilyId(body.familyId);
  if (!familyId) return json({ ok: false, error: 'invalid family id' }, 400);
  const type = String(body.type || '');
  if (SYNC_TYPES.indexOf(type) === -1) return json({ ok: false, error: 'invalid type' }, 400);

  const metaRaw = await env.PHARMACY_KV.get('meta:' + familyId);
  if (!metaRaw) return json({ ok: false, error: 'family not found' }, 404);

  let data = body.data;
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) { data = null; } }
  if (data == null) return json({ ok: false, error: 'invalid data' }, 400);

  const serialized = JSON.stringify(data);
  if (serialized.length > MAX_DATA_BYTES) return json({ ok: false, error: 'data too large' }, 413);

  const ts = Number(body.ts) || Date.now();
  const key = 'data:' + familyId + ':' + type;
  const prevRaw = await env.PHARMACY_KV.get(key);
  let ver = 1;
  if (prevRaw) {
    try { ver = (JSON.parse(prevRaw).ver || 0) + 1; } catch (e) {}
  }
  const record = { data, ts, ver, by: String(body.deviceId || '').slice(0, 64), updatedAt: Date.now() };
  await env.PHARMACY_KV.put(key, JSON.stringify(record));

  // 更新设备活跃时间
  const meta = JSON.parse(metaRaw);
  const did = String(body.deviceId || '');
  if (meta.devices && did && meta.devices[did]) meta.devices[did].lastSeen = Date.now();
  await env.PHARMACY_KV.put('meta:' + familyId, JSON.stringify(meta));

  return json({ ok: true, ts, ver, type });
}

async function syncGet(request, env) {
  const params = request.method === 'POST'
    ? (await readBody(request) || {})
    : Object.fromEntries(new URL(request.url).searchParams.entries());
  const familyId = validateFamilyId(params.familyId);
  if (!familyId) return json({ ok: false, error: 'invalid family id' }, 400);
  const type = String(params.type || '');
  if (SYNC_TYPES.indexOf(type) === -1) return json({ ok: false, error: 'invalid type' }, 400);

  const raw = await env.PHARMACY_KV.get('data:' + familyId + ':' + type);
  if (!raw) return json({ ok: true, familyId, type, data: null, ts: 0 });
  const rec = JSON.parse(raw);
  return json({ ok: true, familyId, type, data: rec.data, ts: rec.ts || 0, ver: rec.ver || 1 });
}

async function syncMeta(request, env) {
  const params = request.method === 'POST'
    ? (await readBody(request) || {})
    : Object.fromEntries(new URL(request.url).searchParams.entries());
  const familyId = validateFamilyId(params.familyId);
  if (!familyId) return json({ ok: false, error: 'invalid family id' }, 400);
  const raw = await env.PHARMACY_KV.get('meta:' + familyId);
  if (!raw) return json({ ok: false, error: 'family not found' }, 404);
  const meta = JSON.parse(raw);
  return json({ ok: true, familyId, familyName: meta.familyName, devices: meta.devices || {}, createdAt: meta.createdAt });
}

async function syncLeave(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const familyId = validateFamilyId(body.familyId);
  if (!familyId) return json({ ok: false, error: 'invalid family id' }, 400);
  const raw = await env.PHARMACY_KV.get('meta:' + familyId);
  if (!raw) return json({ ok: true, familyId });
  const meta = JSON.parse(raw);
  const deviceId = String(body.deviceId || '');
  if (meta.devices && deviceId && meta.devices[deviceId]) delete meta.devices[deviceId];
  await env.PHARMACY_KV.put('meta:' + familyId, JSON.stringify(meta));
  return json({ ok: true, familyId });
}

/* ============================================================
 * v3 账号体系（D1）
 * ============================================================ */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SYNC_ACCOUNT_TYPES = ['cabinet', 'members', 'reminders'];

function bytesToHex(arr) {
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}
function randomHex(bytes) {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(bytes)));
}
async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: hexToBytes(saltHex), iterations: 100000 },
    key, 256
  );
  return bytesToHex(new Uint8Array(bits));
}
function now() { return Date.now(); }

/* 从请求提取会话并返回用户（无会话返回 null） */
async function getUserFromSession(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return null;
  const row = await env.pharmacy_db.prepare('SELECT user_id, expires_at FROM sessions WHERE token = ?').bind(token).first();
  if (!row) return null;
  if (row.expires_at < now()) {
    await env.pharmacy_db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  const user = await env.pharmacy_db.prepare('SELECT * FROM users WHERE id = ? AND status = 1').bind(row.user_id).first();
  return user || null;
}

async function requireAuth(request, env) {
  const user = await getUserFromSession(request, env);
  if (!user) throw json({ ok: false, error: 'unauthorized' }, 401);
  return user;
}

function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name, isAdmin: !!u.is_admin, createdAt: u.created_at };
}

async function createSession(env, userId) {
  const token = randomHex(32);
  const expiresAt = now() + 30 * 24 * 3600 * 1000; // 30 天
  await env.pharmacy_db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').bind(token, userId, expiresAt).run();
  return token;
}

async function handleRegister(request, env) {
  if (!env.pharmacy_db) return json({ ok: false, error: 'database not bound' }, 501);
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const name = String(body.name || '').trim().slice(0, 40);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: '邮箱格式不正确' }, 400);
  if (password.length < 6 || password.length > 64) return json({ ok: false, error: '密码长度需为 6-64 位' }, 400);

  const existing = await env.pharmacy_db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return json({ ok: false, error: '该邮箱已注册' }, 409);

  const id = 'u-' + randomHex(16);
  const salt = randomHex(16);
  const hash = await hashPassword(password, salt);
  const isAdmin = (env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).indexOf(email) !== -1 ? 1 : 0;
  const securityQ = String(body.securityQ || '').trim().slice(0, 100);
  const securityA = String(body.securityA || '').trim().slice(0, 100);

  await env.pharmacy_db.prepare(
    'INSERT INTO users (id, email, name, pass_hash, pass_salt, security_q, security_a, is_admin, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)'
  ).bind(id, email, name || email.split('@')[0], hash, salt, securityQ, securityA, isAdmin, now()).run();

  const token = await createSession(env, id);
  return json({ ok: true, token, user: publicUser({ id, email, name: name || email.split('@')[0], is_admin: isAdmin, created_at: now() }) }, 200);
}

async function handleLogin(request, env) {
  if (!env.pharmacy_db) return json({ ok: false, error: 'database not bound' }, 501);
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const user = await env.pharmacy_db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (!user) return json({ ok: false, error: '邮箱或密码错误' }, 401);
  if (user.status !== 1) return json({ ok: false, error: '账号已被停用' }, 403);

  const hash = await hashPassword(password, user.pass_salt);
  if (hash !== user.pass_hash) return json({ ok: false, error: '邮箱或密码错误' }, 401);

  // 清理该用户过期会话
  await env.pharmacy_db.prepare('DELETE FROM sessions WHERE user_id = ? AND expires_at < ?').bind(user.id, now()).run();
  const token = await createSession(env, user.id);
  return json({ ok: true, token, user: publicUser(user) }, 200);
}

async function handleLogout(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (token) await env.pharmacy_db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
  return json({ ok: true }, 200);
}

async function handleMe(request, env) {
  try {
    const user = await requireAuth(request, env);
    return json({ ok: true, user: publicUser(user) }, 200);
  } catch (e) {
    if (e instanceof Response) return e;
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
}

async function handleChangePassword(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  let user;
  try { user = await requireAuth(request, env); } catch (e) { return e instanceof Response ? e : json({ ok: false, error: 'unauthorized' }, 401); }

  const oldPassword = String(body.oldPassword || '');
  const newPassword = String(body.newPassword || '');
  if (newPassword.length < 6 || newPassword.length > 64) return json({ ok: false, error: '新密码长度需为 6-64 位' }, 400);

  const oldHash = await hashPassword(oldPassword, user.pass_salt);
  if (oldHash !== user.pass_hash) return json({ ok: false, error: '原密码不正确' }, 401);

  const salt = randomHex(16);
  const hash = await hashPassword(newPassword, salt);
  await env.pharmacy_db.prepare('UPDATE users SET pass_hash = ?, pass_salt = ? WHERE id = ?').bind(hash, salt, user.id).run();
  // 使其它会话失效，仅保留当前
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  await env.pharmacy_db.prepare('DELETE FROM sessions WHERE user_id = ? AND token != ?').bind(user.id, token).run();
  return json({ ok: true }, 200);
}

async function handleResetPassword(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const email = String(body.email || '').trim().toLowerCase();
  const answer = String(body.answer || '').trim();
  const newPassword = String(body.newPassword || '');
  const user = await env.pharmacy_db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (!user || !user.security_q) return json({ ok: false, error: '该账号未设置密保问题，无法自助找回' }, 404);
  if (answer !== user.security_a) return json({ ok: false, error: '密保答案不正确' }, 401);
  if (newPassword.length < 6 || newPassword.length > 64) return json({ ok: false, error: '新密码长度需为 6-64 位' }, 400);
  const salt = randomHex(16);
  const hash = await hashPassword(newPassword, salt);
  await env.pharmacy_db.prepare('UPDATE users SET pass_hash = ?, pass_salt = ? WHERE id = ?').bind(hash, salt, user.id).run();
  await env.pharmacy_db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run();
  return json({ ok: true }, 200);
}

/* ===== 账号级同步（D1 sync_data 表） ===== */
async function accountSyncPut(request, env) {
  const user = await requireAuth(request, env).catch(e => null);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const type = String(body.type || '');
  if (SYNC_ACCOUNT_TYPES.indexOf(type) === -1) return json({ ok: false, error: 'invalid type' }, 400);
  let data = body.data;
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) { data = null; } }
  if (data == null) return json({ ok: false, error: 'invalid data' }, 400);
  const serialized = JSON.stringify(data);
  if (serialized.length > MAX_DATA_BYTES) return json({ ok: false, error: 'data too large' }, 413);
  const ts = Number(body.ts) || now();
  const prev = await env.pharmacy_db.prepare('SELECT ver FROM sync_data WHERE user_id = ? AND type = ?').bind(user.id, type).first();
  const ver = prev ? prev.ver + 1 : 1;
  await env.pharmacy_db.prepare(
    'INSERT INTO sync_data (user_id, type, data, ts, ver) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, type) DO UPDATE SET data = excluded.data, ts = excluded.ts, ver = excluded.ver'
  ).bind(user.id, type, serialized, ts, ver).run();
  return json({ ok: true, type, ts, ver }, 200);
}

async function accountSyncGet(request, env) {
  const user = await requireAuth(request, env).catch(e => null);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  const type = new URL(request.url).searchParams.get('type') || '';
  if (SYNC_ACCOUNT_TYPES.indexOf(type) === -1) return json({ ok: false, error: 'invalid type' }, 400);
  const row = await env.pharmacy_db.prepare('SELECT data, ts, ver FROM sync_data WHERE user_id = ? AND type = ?').bind(user.id, type).first();
  if (!row) return json({ ok: true, type, data: null, ts: 0 }, 200);
  return json({ ok: true, type, data: JSON.parse(row.data), ts: row.ts, ver: row.ver }, 200);
}

async function accountSyncAll(request, env) {
  const user = await requireAuth(request, env).catch(e => null);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  const rows = await env.pharmacy_db.prepare('SELECT type, data, ts, ver FROM sync_data WHERE user_id = ?').bind(user.id).all();
  const out = {};
  SYNC_ACCOUNT_TYPES.forEach(t => { out[t] = { data: null, ts: 0 }; });
  (rows.results || []).forEach(r => {
    out[r.type] = { data: JSON.parse(r.data), ts: r.ts, ver: r.ver };
  });
  return json({ ok: true, data: out }, 200);
}

/* ===== 用药记录 ===== */
async function logsAdd(request, env) {
  const user = await requireAuth(request, env).catch(e => null);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const drug = String(body.drug || '').trim().slice(0, 100);
  if (!drug) return json({ ok: false, error: '请输入药品名称' }, 400);
  const id = 'l-' + randomHex(16);
  const takenAt = Number(body.takenAt) || now();
  await env.pharmacy_db.prepare(
    'INSERT INTO med_logs (id, user_id, drug, dose, taken_at, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, user.id, drug, String(body.dose || '').slice(0, 100), takenAt, String(body.note || '').slice(0, 300), now()).run();
  const row = await env.pharmacy_db.prepare('SELECT * FROM med_logs WHERE id = ?').bind(id).first();
  return json({ ok: true, log: row }, 200);
}

async function logsList(request, env) {
  const user = await requireAuth(request, env).catch(e => null);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  const limit = Math.min(Number(new URL(request.url).searchParams.get('limit')) || 200, 1000);
  const rows = await env.pharmacy_db.prepare('SELECT * FROM med_logs WHERE user_id = ? ORDER BY taken_at DESC LIMIT ?').bind(user.id, limit).all();
  return json({ ok: true, logs: rows.results || [] }, 200);
}

async function logsDelete(request, env) {
  const user = await requireAuth(request, env).catch(e => null);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  const body = await readBody(request);
  const id = String((body && body.id) || '').slice(0, 64);
  if (!id) return json({ ok: false, error: 'invalid id' }, 400);
  await env.pharmacy_db.prepare('DELETE FROM med_logs WHERE id = ? AND user_id = ?').bind(id, user.id).run();
  return json({ ok: true }, 200);
}

/* ===== 健康档案 ===== */
const HEALTH_TYPES = ['blood_pressure', 'blood_glucose', 'weight', 'heart_rate', 'temperature'];
async function healthAdd(request, env) {
  const user = await requireAuth(request, env).catch(e => null);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const rtype = String(body.rtype || '');
  if (HEALTH_TYPES.indexOf(rtype) === -1) return json({ ok: false, error: 'invalid type' }, 400);
  const value = Number(body.value);
  if (isNaN(value) || value <= 0) return json({ ok: false, error: '数值不合法' }, 400);
  const id = 'h-' + randomHex(16);
  await env.pharmacy_db.prepare(
    'INSERT INTO health_records (id, user_id, rtype, value, unit, recorded_at, note) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, user.id, rtype, value, String(body.unit || '').slice(0, 20), Number(body.recordedAt) || now(), String(body.note || '').slice(0, 300)).run();
  const row = await env.pharmacy_db.prepare('SELECT * FROM health_records WHERE id = ?').bind(id).first();
  return json({ ok: true, record: row }, 200);
}

async function healthList(request, env) {
  const user = await requireAuth(request, env).catch(e => null);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  const rtype = new URL(request.url).searchParams.get('rtype') || '';
  const limit = Math.min(Number(new URL(request.url).searchParams.get('limit')) || 300, 1000);
  let rows;
  if (rtype) {
    rows = await env.pharmacy_db.prepare('SELECT * FROM health_records WHERE user_id = ? AND rtype = ? ORDER BY recorded_at DESC LIMIT ?').bind(user.id, rtype, limit).all();
  } else {
    rows = await env.pharmacy_db.prepare('SELECT * FROM health_records WHERE user_id = ? ORDER BY recorded_at DESC LIMIT ?').bind(user.id, limit).all();
  }
  return json({ ok: true, records: rows.results || [] }, 200);
}

async function healthDelete(request, env) {
  const user = await requireAuth(request, env).catch(e => null);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  const body = await readBody(request);
  const id = String((body && body.id) || '').slice(0, 64);
  if (!id) return json({ ok: false, error: 'invalid id' }, 400);
  await env.pharmacy_db.prepare('DELETE FROM health_records WHERE id = ? AND user_id = ?').bind(id, user.id).run();
  return json({ ok: true }, 200);
}

/* ===== 公告（公开读取） ===== */
async function announcementsList(request, env) {
  const rows = await env.pharmacy_db.prepare('SELECT id, title, body, created_at FROM announcements WHERE active = 1 ORDER BY created_at DESC LIMIT 10').all();
  return json({ ok: true, announcements: rows.results || [] }, 200);
}

/* ===== 管理后台 ===== */
async function requireAdmin(request, env) {
  const user = await requireAuth(request, env);
  if (!user || !user.is_admin) throw json({ ok: false, error: 'admin required' }, 403);
  return user;
}

async function adminUsers(request, env) {
  let user;
  try { user = await requireAdmin(request, env); } catch (e) { return e instanceof Response ? e : json({ ok: false, error: 'admin required' }, 403); }
  const rows = await env.pharmacy_db.prepare('SELECT id, email, name, is_admin, status, created_at FROM users ORDER BY created_at DESC LIMIT 200').all();
  return json({ ok: true, users: rows.results || [] }, 200);
}

async function adminStats(request, env) {
  try { await requireAdmin(request, env); } catch (e) { return e instanceof Response ? e : json({ ok: false, error: 'admin required' }, 403); }
  const uc = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM users').first();
  const lc = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM med_logs').first();
  const hc = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM health_records').first();
  const sc = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM sync_data').first();
  return json({ ok: true, stats: { users: uc.c, logs: lc.c, health: hc.c, syncs: sc.c } }, 200);
}

async function adminAnnouncement(request, env) {
  try { await requireAdmin(request, env); } catch (e) { return e instanceof Response ? e : json({ ok: false, error: 'admin required' }, 403); }
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const title = String(body.title || '').trim().slice(0, 100);
  const content = String(body.body || '').trim().slice(0, 2000);
  if (!title) return json({ ok: false, error: '标题不能为空' }, 400);
  const id = 'a-' + randomHex(16);
  await env.pharmacy_db.prepare(
    'INSERT INTO announcements (id, title, body, active, created_at) VALUES (?, ?, ?, 1, ?)'
  ).bind(id, title, content, now()).run();
  return json({ ok: true, id }, 200);
}

/* ============================================================
 * v6.4 AI 系统中枢：反馈收集 / 使用埋点 / AI 自主数据更新
 * ============================================================ */

async function feedbackSubmit(request, env) {
  if (!env.pharmacy_db) return json({ ok: false, error: 'database not bound' }, 501);
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const content = String(body.content || '').trim().slice(0, 2000);
  if (!content) return json({ ok: false, error: '反馈内容不能为空' }, 400);
  const ftype = ['bug', 'suggestion', 'drug', 'other'].indexOf(String(body.type || 'other')) !== -1 ? String(body.type) : 'other';
  let userId = '';
  try { const u = await getUserFromSession(request, env); if (u) userId = u.id; } catch (e) {}
  const id = 'f-' + randomHex(16);
  await env.pharmacy_db.prepare(
    'INSERT INTO feedback (id, user_id, ftype, content, page, contact, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)'
  ).bind(id, userId, ftype, content, String(body.page || '').slice(0, 100), String(body.contact || '').slice(0, 100), now()).run();
  return json({ ok: true, id }, 200);
}

async function trackSearch(request, env) {
  if (!env.pharmacy_db) return json({ ok: false, error: 'database not bound' }, 501);
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const q = String(body.query || '').trim().slice(0, 100);
  if (!q) return json({ ok: true, skipped: true }, 200);
  const hit = body.hit ? 1 : 0;
  // 只记录未命中与低频命中，控制数据量
  if (hit) {
    return json({ ok: true, skipped: true }, 200);
  }
  const id = 's-' + randomHex(16);
  await env.pharmacy_db.prepare(
    'INSERT INTO search_logs (id, query, hit, created_at) VALUES (?, ?, 0, ?)'
  ).bind(id, q, now()).run();
  return json({ ok: true }, 200);
}

async function trackAiRating(request, env) {
  if (!env.pharmacy_db) return json({ ok: false, error: 'database not bound' }, 501);
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  if (!body) return json({ ok: false, error: 'bad json' }, 400);
  const question = String(body.question || '').trim().slice(0, 200);
  const rating = body.rating > 0 ? 1 : -1;
  let userId = '';
  try { const u = await getUserFromSession(request, env); if (u) userId = u.id; } catch (e) {}
  const id = 'r-' + randomHex(16);
  await env.pharmacy_db.prepare(
    'INSERT INTO ai_ratings (id, user_id, question, rating, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, userId, question, rating, now()).run();
  return json({ ok: true }, 200);
}

/* 公开：AI 已审核通过的药品数据条目（前端启动时合并进本地库，实现零部署更新） */
async function aiDrugEntriesList(request, env) {
  if (!env.pharmacy_db) return json({ ok: false, error: 'database not bound' }, 501);
  const rows = await env.pharmacy_db.prepare('SELECT id, name, data_json FROM ai_drug_entries WHERE status = 1 ORDER BY created_at DESC LIMIT 500').all();
  const entries = {};
  (rows.results || []).forEach(r => {
    try { entries[r.name] = JSON.parse(r.data_json); } catch (e) {}
  });
  return json({ ok: true, entries }, 200);
}

async function opsOverview(request, env) {
  let user;
  try { user = await requireAdmin(request, env); } catch (e) { return e instanceof Response ? e : json({ ok: false, error: 'admin required' }, 403); }
  const week = now() - 7 * 24 * 3600 * 1000;
  const fb = await env.pharmacy_db.prepare('SELECT * FROM feedback ORDER BY created_at DESC LIMIT 30').all();
  const fbCount = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM feedback WHERE created_at > ?').bind(week).first();
  const topMiss = await env.pharmacy_db.prepare('SELECT query, COUNT(*) AS c FROM search_logs GROUP BY query ORDER BY c DESC LIMIT 20').all();
  const missTotal = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM search_logs').first();
  const pos = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM ai_ratings WHERE rating = 1').first();
  const neg = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM ai_ratings WHERE rating = -1').first();
  const drafts = await env.pharmacy_db.prepare('SELECT * FROM ai_drug_entries ORDER BY created_at DESC LIMIT 30').all();
  const approved = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM ai_drug_entries WHERE status = 1').first();
  return json({
    ok: true,
    feedbackCount: fbCount.c,
    feedback: (fb.results || []).map(f => ({ id: f.id, type: f.ftype, content: f.content, page: f.page, createdAt: f.created_at, status: f.status })),
    topMissed: (topMiss.results || []),
    missTotal: missTotal.c,
    ratings: { positive: pos.c, negative: neg.c },
    drafts: (drafts.results || []).map(d => ({ id: d.id, name: d.name, status: d.status, createdAt: d.created_at })),
    approvedCount: approved.c
  }, 200);
}

/* v6.4 AI 系统管理用：多通道调用（SiliconFlow → 百炼 → pollinations），返回 message.content */
async function callBestProvider(env, message) {
  const attempts = [];
  if (env.SILICONFLOW_KEY) attempts.push(() => callSiliconFlow(env, message, false));
  if (env.DASHSCOPE_KEY) attempts.push(() => callDashScope(env, message, false));
  attempts.push(() => callPollinations(message, false));
  let lastErr = '';
  for (const fn of attempts) {
    try {
      const data = await fn();
      const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
      if (content) return content;
    } catch (e) { lastErr = e.message; }
  }
  throw new Error('all providers failed: ' + lastErr);
}

async function opsAiReport(request, env) {
  let user;
  try { user = await requireAdmin(request, env); } catch (e) { return e instanceof Response ? e : json({ ok: false, error: 'admin required' }, 403); }
  const week = now() - 7 * 24 * 3600 * 1000;
  const fbCount = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM feedback WHERE created_at > ?').bind(week).first();
  const topMiss = await env.pharmacy_db.prepare('SELECT query, COUNT(*) AS c FROM search_logs GROUP BY query ORDER BY c DESC LIMIT 15').all();
  const pos = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM ai_ratings WHERE rating = 1').first();
  const neg = await env.pharmacy_db.prepare('SELECT COUNT(*) AS c FROM ai_ratings WHERE rating = -1').first();
  const fbRows = await env.pharmacy_db.prepare('SELECT ftype, content FROM feedback ORDER BY created_at DESC LIMIT 10').all();
  const missed = (topMiss.results || []).map(m => m.query + '(' + m.c + '次)').join('、');
  const fbText = (fbRows.results || []).map(f => '[' + f.ftype + ']' + f.content.slice(0, 60)).join('；');
  const prompt = '你是家庭药师系统的运维分析助手。根据以下一周数据，用中文输出一份简明的系统运营分析报告（300字内），包括：1. 用户反馈要点与需优先修复的问题；2. 高频搜索未命中的药品（数据缺口）；3. AI 回答质量概况（好评' + pos.c + '条/差评' + neg.c + '条）；4. 给出3条本周行动建议。数据：反馈' + fbCount.c + '条：' + fbText + '；未命中药品：' + (missed || '无') + '。不用表情符号，直接分点输出。';
  try {
    const content = await callBestProvider(env, prompt);
    return json({ ok: true, report: content }, 200);
  } catch (e) {
    return json({ ok: false, error: 'report generation failed: ' + e.message }, 502);
  }
}

/* AI 为缺失药品起草详细数据（待管理员审核） */
async function opsAiDraft(request, env) {
  let user;
  try { user = await requireAdmin(request, env); } catch (e) { return e instanceof Response ? e : json({ ok: false, error: 'admin required' }, 403); }
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  const name = String((body && body.name) || '').trim().slice(0, 40);
  if (!name) return json({ ok: false, error: '药品名称不能为空' }, 400);
  const prompt = '请为药品「' + name + '」生成一条药品数据（JSON 格式，严格按以下结构，不要任何多余文字）：' +
    '{"indications":"主要适应症","ingredients":"主要成分","dosage":"常见用法用量范围（注明遵医嘱）","adverse":"常见不良反应","contraindications":"重要禁忌","storage":"贮藏条件","cat":"类别"}。' +
    '要求：基于通用药理知识；不确定的信息写"以说明书为准"；所有字段为中文字符串；不要虚构精确剂量，只给常见范围。';
  try {
    const content = await callBestProvider(env, prompt);
    const m = content.match(/\{[\s\S]*\}/);
    if (!m) return json({ ok: false, error: 'AI 未能生成有效数据' }, 502);
    const obj = JSON.parse(m[0]);
    if (!obj.indications) return json({ ok: false, error: 'AI 数据缺少适应症字段' }, 502);
    const id = 'd-' + randomHex(16);
    await env.pharmacy_db.prepare(
      'INSERT INTO ai_drug_entries (id, name, data_json, source, status, created_at) VALUES (?, ?, ?, ?, 0, ?)'
    ).bind(id, name, JSON.stringify(obj), 'ai', now()).run();
    return json({ ok: true, id, name, data: obj }, 200);
  } catch (e) {
    return json({ ok: false, error: 'AI 起草失败: ' + e.message }, 502);
  }
}

/* 管理员审核：通过(1) / 拒绝(2) */
async function opsAiDraftReview(request, env) {
  let user;
  try { user = await requireAdmin(request, env); } catch (e) { return e instanceof Response ? e : json({ ok: false, error: 'admin required' }, 403); }
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const body = await readBody(request);
  const id = String((body && body.id) || '').slice(0, 64);
  const status = Number(body && body.status);
  if (!id || (status !== 1 && status !== 2)) return json({ ok: false, error: 'invalid params' }, 400);
  await env.pharmacy_db.prepare('UPDATE ai_drug_entries SET status = ? WHERE id = ?').bind(status, id).run();
  return json({ ok: true }, 200);
}
