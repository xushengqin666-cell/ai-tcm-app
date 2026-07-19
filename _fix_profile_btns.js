const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 检查 applyLang 有无 profileEditBtn
const hasApply = s.indexOf("document.getElementById('profileEditBtn')") >= 0;
console.log('applyLang 有 profileEditBtn:', hasApply);

// 检查 T.en 中的所有 profile 键
const enIdx = s.indexOf("navHome:'Home'");
const section = s.slice(enIdx - 20, enIdx + 400);
console.log('T.en nav/profile:', section);

// 检查 T.zh 中的 profileLogout (应该只有 T.zh 有)
const zhIdx = s.indexOf("profileLogout:'退出登录'");
console.log('T.zh profileLogout @:', zhIdx);
