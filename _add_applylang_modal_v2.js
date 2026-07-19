const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 找到 toggleLang 之前的位置（applyLang 结束处）
const anchor = "\nfunction toggleLang(){ applyLang(currentLang === 'zh' ? 'en' : 'zh'); }";

const newModalLines = `
  // ===== Modal 元素翻译 (Profile Edit + Auth) =====
  if(el=document.getElementById('profileEditTitle')) el.textContent = t.profileEditTitle;
  if(el=document.getElementById('profileEditNicknameLabel')) el.textContent = t.profileEditNicknameLabel;
  if(el=document.getElementById('profileEditPhoneLabel')) el.textContent = t.profileEditPhoneLabel;
  if(el=document.getElementById('profileEditPhoneHint')) el.textContent = t.profileEditPhoneHint;
  if(el=document.getElementById('profileEditSave')) el.textContent = t.profileEditSave;
  if(el=document.getElementById('profileEditCancel')) el.textContent = t.profileEditCancel;
  if(el=document.getElementById('authTitle')) el.textContent = t.authTitle;
  if(el=document.getElementById('authPhoneLabel')) el.textContent = t.authPhoneLabel;
  if(el=document.getElementById('authPwdLabel')) el.textContent = t.authPwdLabel;
  if(el=document.getElementById('authNicknameLabel')) el.textContent = t.authNicknameLabel;
  if(el=document.getElementById('authLoginBtn')) el.textContent = t.authLogin;
  if(el=document.getElementById('authRegisterBtn')) el.textContent = t.authRegister;
  if(el=document.getElementById('authSwitchBtn')) el.textContent = t.authSwitchTip;
`;

if (s.indexOf(anchor) >= 0) {
  s = s.replace(anchor, newModalLines + anchor);
  console.log('✅ applyLang 已扩展 Modal 元素翻译');
} else {
  console.log('⚠️ 锚点未找到');
}

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
