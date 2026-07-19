const fs = require('fs');
const path = 'C:/Users/xu_fa/ai-tcm-app/index.html';
let s = fs.readFileSync(path, 'utf8');

// 找到 applyLang 函数
const fnStart = s.indexOf("function applyLang(lang)");
if (fnStart < 0) { console.log('❌ applyLang 函数未找到'); process.exit(1); }
console.log('applyLang 函数开始 @:', fnStart);

// 从函数开始向后找，匹配括号
let depth = 0;
let i = fnStart;
while (i < s.length) {
  if (s[i] === '{') depth++;
  else if (s[i] === '}') {
    depth--;
    if (depth === 0) break;
  }
  i++;
}
const fnEnd = i;
console.log('applyLang 函数结束 @:', fnEnd);
console.log('函数末尾内容:', JSON.stringify(s.slice(fnEnd - 30, fnEnd + 20)));

// 在函数末尾 } 之前追加 profile 按钮翻译
const addCode = `
  // Profile 按钮
  if(el=document.getElementById('profileTitle')) el.textContent = t.profileTitle;
  if(el=document.getElementById('profileEditBtn')) el.textContent = t.profileEdit;
  if(el=document.getElementById('profileSettingsBtn')) el.textContent = t.profileSettings;
  if(el=document.getElementById('profileAboutBtn')) el.textContent = t.profileAbout;
  if(el=document.getElementById('profileLogoutBtn')) el.textContent = t.profileLogout;
`;

s = s.slice(0, fnEnd) + addCode + '\n' + s.slice(fnEnd);

fs.writeFileSync(path, s, 'utf8');
console.log('✅ applyLang profile 按钮翻译已添加');
console.log('文件大小:', s.length);
