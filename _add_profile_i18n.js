const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 在 i18n 扩展中追加 profile 按钮翻译
const anchor = "if(el=document.getElementById('cabAddBtn')) el.textContent = t.cabAddBtn;";
const addition = `if(el=document.getElementById('profileEditBtn')) el.textContent = t.profileEdit;
  if(el=document.getElementById('profileSettingsBtn')) el.textContent = t.profileSettings;
  if(el=document.getElementById('profileAboutBtn')) el.textContent = t.profileAbout;
  if(el=document.getElementById('profileLogoutBtn')) el.textContent = t.profileLogout;`;

if (s.indexOf(anchor) >= 0) {
  s = s.replace(anchor, anchor + '\n  ' + addition);
  console.log('✅ profile 按钮 i18n 已添加');
} else {
  console.log('⚠️ 锚点未找到');
}

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
