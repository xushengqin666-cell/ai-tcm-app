/**
 * 彩云智药 - Supabase 配置与初始化
 * 用于端手互通数据同步
 */

// Supabase 项目配置（创建项目后替换这些值）
const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL', // 例如: https://xxxxx.supabase.co
  anonKey: 'YOUR_SUPABASE_ANON_KEY', // 公开的匿名密钥
};

// 初始化客户端
let supabaseClient = null;

function initSupabase() {
  if (supabaseClient) return supabaseClient;

  if (typeof window.supabase !== 'undefined') {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('[Supabase] 客户端初始化成功');
    return supabaseClient;
  }

  console.error('[Supabase] SDK 未加载，请确保引入了 supabase-js');
  return null;
}

// 获取当前用户
function getCurrentUser() {
  return supabaseClient?.auth.getUser();
}

// 检查登录状态
async function isLoggedIn() {
  if (!supabaseClient) return false;
  const { data: { session } } = await supabaseClient.auth.getSession();
  return !!session;
}

// 导出
window.pharmacySupabase = {
  init: initSupabase,
  getClient: () => supabaseClient,
  getCurrentUser,
  isLoggedIn,
  config: SUPABASE_CONFIG,
};
