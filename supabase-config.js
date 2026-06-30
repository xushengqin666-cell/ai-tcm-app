/**
 * 家庭药师 - Supabase 配置
 * 用于端手互通数据同步（云备份 + 设备配对）
 */

const SUPABASE_CONFIG = {
  url: 'https://ossrmzbvamjkjzqtitpc.supabase.co',
  // 新版 publishable key（2025 Supabase API key 改革后只能拿到这个）
  // 注意：旧版 JWT anon key (eyJ...) 已被 Supabase 弃用，新项目不再生成
  anonKey: 'sb_publishable_y3TyMnV7m_k3daXEDlIHtg_p6oFte6x',
};

let supabaseClient = null;
let supabaseInitError = null;

function initSupabase() {
  if (supabaseClient) return supabaseClient;
  if (supabaseInitError) return null;

  if (typeof window.supabase === 'undefined') {
    supabaseInitError = 'SDK 未加载';
    console.error('[Supabase]', supabaseInitError);
    return null;
  }

  try {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('[Supabase] 客户端初始化成功');
    return supabaseClient;
  } catch (err) {
    supabaseInitError = err.message;
    console.error('[Supabase] 初始化失败:', err);
    return null;
  }
}

window.pharmacySupabase = {
  init: initSupabase,
  getClient: () => supabaseClient,
  config: SUPABASE_CONFIG,
};
