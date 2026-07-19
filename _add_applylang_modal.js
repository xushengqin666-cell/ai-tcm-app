const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 找到 applyLang 函数，在其末尾添加 Modal 元素翻译
// 找到 profileEditBtn 的翻译行作为锚点
const anchor = "if(peBtn) peBtn.textContent = t.profileEdit;";
const newLines = `if(peBtn) peBtn.textContent = t.profileEdit;
  // Profile Edit Modal
  const pemTitle = document.getElementById('profileEditTitle');
  if(pemTitle) pemTitle.textContent = t.profileEditTitle;
  const pemNickLabel = document.getElementById('profileEditNicknameLabel');
  if(pemNickLabel) pemNickLabel.textContent = t.profileEditNicknameLabel;
  const pemPhoneLabel = document.getElementById('profileEditPhoneLabel');
  if(pemPhoneLabel) pemPhoneLabel.textContent = t.profileEditPhoneLabel;
  const pemPhoneHint = document.getElementById('profileEditPhoneHint');
  if(pemPhoneHint) pemPhoneHint.textContent = t.profileEditPhoneHint;
  const pemSave = document.getElementById('profileEditSave');
  if(pemSave) pemSave.textContent = t.profileEditSave;
  const pemCancel = document.getElementById('profileEditCancel');
  if(pemCancel) pemCancel.textContent = t.profileEditCancel;
  // Auth Modal
  const aTitle = document.getElementById('authTitle');
  if(aTitle) aTitle.textContent = t.authTitle;
  const aPhoneLabel = document.getElementById('authPhoneLabel');
  if(aPhoneLabel) aPhoneLabel.textContent = t.authPhoneLabel;
  const aPwdLabel = document.getElementById('authPwdLabel');
  if(aPwdLabel) aPwdLabel.textContent = t.authPwdLabel;
  const aNickLabel = document.getElementById('authNicknameLabel');
  if(aNickLabel) aNickLabel.textContent = t.authNicknameLabel;
  const aLoginBtn = document.getElementById('authLoginBtn');
  if(aLoginBtn) aLoginBtn.textContent = t.authLogin;
  const aRegBtn = document.getElementById('authRegisterBtn');
  if(aRegBtn) aRegBtn.textContent = t.authRegister;
  const aSwitchBtn = document.getElementById('authSwitchBtn');
  if(aSwitchBtn) aSwitchBtn.textContent = t.authSwitchTip;`;

if (s.indexOf(anchor) >= 0) {
  s = s.replace(anchor, newLines);
  console.log('✅ applyLang 已扩展处理 Modal 元素');
} else {
  console.log('⚠️ applyLang 锚点未找到,使用备用搜索');
  // 备用：找 applyLang 函数的结束位置
  const idx = s.indexOf('if(peBtn) peBtn');
  if (idx >= 0) {
    // 找到这一行的结尾
    const lineEnd = s.indexOf(';', idx);
    if (lineEnd > 0) {
      s = s.slice(0, lineEnd + 1) + '\n  ' + newLines.split('\n').slice(1).join('\n  ') + s.slice(lineEnd + 1);
      console.log('✅ applyLang 已扩展 (备用)');
    }
  }
}

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
