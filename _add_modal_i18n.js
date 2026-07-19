const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 1. T.zh: 添加 Profile/Auth Modal 翻译键
const oldZhEnd = "profileEdit:'编辑资料',profileSettings:'设置',profileAbout:'关于我们',profileLogout:'退出登录',";
const newZhEnd = "profileEdit:'编辑资料',profileSettings:'设置',profileAbout:'关于我们',profileLogout:'退出登录',profileEditTitle:'✏️ 编辑资料',profileEditNicknameLabel:'昵称',profileEditPhoneLabel:'手机号',profileEditPhoneHint:'手机号不可修改',profileEditSave:'保存',profileEditCancel:'取消',login:'🔐 登录',register:'注册',authTitle:'🔐 登录',authPhoneLabel:'手机号',authPwdLabel:'密码',authNicknameLabel:'昵称（选填）',authLogin:'登录',authRegister:'注册',authSwitchTip:'没有账号？立即注册',";
if (s.indexOf(oldZhEnd) >= 0) {
  s = s.replace(oldZhEnd, newZhEnd);
  console.log('✅ T.zh Modal 键已添加');
} else {
  console.log('⚠️ T.zh 锚点未找到');
}

// 2. T.en: 添加对应英文键
const oldEnEnd = "profileEdit:'Edit Profile',profileSettings:'Settings',profileAbout:'About Us',profileLogout:'Logout',";
const newEnEnd = "profileEdit:'Edit Profile',profileSettings:'Settings',profileAbout:'About Us',profileLogout:'Logout',profileEditTitle:'✏️ Edit Profile',profileEditNicknameLabel:'Nickname',profileEditPhoneLabel:'Phone',profileEditPhoneHint:'Phone cannot be changed',profileEditSave:'Save',profileEditCancel:'Cancel',login:'🔐 Login',register:'Register',authTitle:'🔐 Login',authPhoneLabel:'Phone',authPwdLabel:'Password',authNicknameLabel:'Nickname (optional)',authLogin:'Login',authRegister:'Register',authSwitchTip:'No account? Register now',";
if (s.indexOf(oldEnEnd) >= 0) {
  s = s.replace(oldEnEnd, newEnEnd);
  console.log('✅ T.en Modal 键已添加');
} else {
  console.log('⚠️ T.en 锚点未找到');
}

// 3. 修复 authLoginBtn/authRegisterBtn 按钮 ID
const oldAuthBtn = `<button id="authLoginBtn" onclick="doLogin()" style="flex:1;padding:10px;background:var(--primary,#1aad19);color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:500">登录</button>
      <button id="authRegisterBtn" onclick="doRegister()" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;color:var(--text-primary)">注册</button>`;
const newAuthBtn = `<button id="authLoginBtn" onclick="doLogin()" style="flex:1;padding:10px;background:var(--primary,#1aad19);color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:500">登录</button>
      <button id="authRegisterBtn" onclick="doRegister()" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;color:var(--text-primary)">注册</button>
      <button id="authSwitchBtn" onclick="switchAuthMode()" style="width:100%;padding:8px;background:none;border:none;color:var(--primary,#1aad19);font-size:12px;cursor:pointer;margin-top:8px">没有账号？立即注册</button>`;
if (s.indexOf(oldAuthBtn) >= 0) {
  s = s.replace(oldAuthBtn, newAuthBtn);
  console.log('✅ authSwitchBtn 已添加');
} else {
  console.log('⚠️ auth 按钮锚点未找到');
}

// 4. Modal CSS (添加到 <style> 块末尾)
const modalCSS = `
.modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center; }
.modal[style*="display:flex"], .modal[style*="display: flex"] { display: flex !important; }
`;
const styleEnd = '</style>';
if (s.indexOf(styleEnd) >= 0) {
  // 找到最后一个 </style> 之前的合适位置
  const lastStyle = s.lastIndexOf(styleEnd);
  s = s.slice(0, lastStyle) + modalCSS + s.slice(lastStyle);
  console.log('✅ Modal CSS 已添加');
}

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
