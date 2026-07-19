const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
console.log('文件大小:', s.length);

// 1. T 对象语法
const tBlock = s.slice(s.indexOf('var T = {'), s.indexOf('};', s.indexOf('var T = {')) + 2);
try {
  const T = new Function(tBlock + '; return T;')();
  console.log('✅ T 对象语法 OK, zh:', Object.keys(T.zh).length, 'en:', Object.keys(T.en).length);
} catch(e) {
  console.log('❌ T 语法错误:', e.message);
}

// 2. applyLang 语法
try {
  const start = s.indexOf('function applyLang');
  const end = s.indexOf('function toggleLang', start);
  new Function(s.slice(start, end));
  console.log('✅ applyLang 语法 OK');
} catch(e) {
  console.log('❌ applyLang 语法错误:', e.message);
}

// 3. Profile 函数语法
try {
  const start = s.indexOf('// ===== 我的页面 (Modal 版) =====');
  const end = s.indexOf('// ===== 登录/注册 =====', start);
  new Function(s.slice(start, end));
  console.log('✅ Profile 函数 OK');
} catch(e) {
  console.log('❌ Profile 语法错误:', e.message);
}

// 4. Auth 函数语法
try {
  const start = s.indexOf('// ===== 登录/注册 =====');
  const end = s.indexOf('// ===== ', start + 10);
  new Function(s.slice(start, end));
  console.log('✅ Auth 函数 OK');
} catch(e) {
  console.log('❌ Auth 语法错误:', e.message);
}

// 5. 关键 ID 唯一性检查
const ids = ['profileEditModal','profileEditTitle','profileEditNicknameLabel','profileEditNickname',
  'profileEditPhoneLabel','profileEditPhone','profileEditSave','profileEditCancel',
  'authModal','modalAuthTitle','authPhoneLabel','authPwdLabel','authNicknameLabel',
  'authPhone','authPwd','authLoginBtn','authRegisterBtn','authSwitchBtn'];
console.log('\n=== ID 唯一性检查 ===');
ids.forEach(id => {
  const count = (s.match(new RegExp('id="' + id + '"', 'g')) || []).length;
  console.log(id + ':', count === 1 ? '✅' : '❌ ' + count + '个');
});

// 6. Modal CSS
console.log('\n=== Modal CSS ===');
console.log('.modal count:', (s.match(/\.modal\s*\{/g) || []).length);
console.log('modal display:flex count:', (s.match(/modal\[style\*="display:flex"\]/g) || []).length);

// 7. 文件基本标签检查
console.log('\n=== 基本结构 ===');
console.log('<style>:', (s.match(/<style>/g) || []).length);
console.log('</style>:', (s.match(/<\/style>/g) || []).length);
console.log('<body>:', (s.match(/<body/g) || []).length);
console.log('</body>:', (s.match(/<\/body>/g) || []).length);
console.log('<html>:', (s.match(/<html/g) || []).length);
console.log('</html>:', (s.match(/<\/html>/g) || []).length);
