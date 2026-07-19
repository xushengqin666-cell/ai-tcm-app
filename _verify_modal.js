const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 验证语法：用 new Function 包装（var T 可以作为表达式起点）
const tBlock = s.slice(s.indexOf('var T = {'), s.indexOf('};', s.indexOf('var T = {')) + 2);
try {
  const T = new Function(tBlock + '; return T;')();
  console.log('✅ T 对象语法 OK, 键数量:', Object.keys(T.zh).length, 'zh,', Object.keys(T.en).length, 'en');
  // 检查关键键
  ['profileEdit', 'profileEditTitle', 'profileEditSave', 'authTitle', 'authLogin', 'authSwitchTip'].forEach(k => {
    console.log(`  ${k}: zh="${T.zh[k]}" en="${T.en[k]}"`);
  });
} catch(e) {
  console.log('❌ T 语法错误:', e.message);
}

// 验证 applyLang 语法（找一个常见错误）
try {
  // 取 applyLang 段
  const start = s.indexOf('function applyLang');
  const end = s.indexOf('function toggleLang', start);
  const body = s.slice(start, end);
  new Function(body);
  console.log('✅ applyLang 函数语法 OK');
} catch(e) {
  console.log('❌ applyLang 语法错误:', e.message);
}

// 验证 profile 函数
try {
  const start = s.indexOf('// ===== 我的页面 (Modal 版) =====');
  const end = s.indexOf('// ===== 登录/注册 =====', start);
  const body = s.slice(start, end);
  new Function(body);
  console.log('✅ Profile 函数语法 OK');
} catch(e) {
  console.log('❌ Profile 语法错误:', e.message);
}

try {
  const start = s.indexOf('// ===== 登录/注册 =====');
  const end = s.indexOf('// ===== ', start + 10);
  const body = s.slice(start, end);
  new Function(body);
  console.log('✅ Auth 函数语法 OK');
} catch(e) {
  console.log('❌ Auth 语法错误:', e.message);
}
