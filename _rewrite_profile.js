const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 1. 找到现有的 profile 函数，替换为新版本
const oldProfileFunctions = `// ===== 我的页面 =====
function openProfile(){
  switchTab('profile');
  loadProfile();
}
function loadProfile(){
  const session = JSON.parse(localStorage.getItem('cy_session') || '{}');
  const users = JSON.parse(localStorage.getItem('cy_users') || '[]');
  const user = users.find(u => u.phone === session.phone);
  const nickEl = document.getElementById('profileNicknameDisplay');
  const phoneEl = document.getElementById('profilePhoneDisplay');
  if(nickEl) nickEl.textContent = user?.nickname || session?.nickname || '未登录';
  if(phoneEl) phoneEl.textContent = user?.phone || session?.phone || '-';
}
function editProfile(){
  const session = JSON.parse(localStorage.getItem('cy_session') || '{}');
  const users = JSON.parse(localStorage.getItem('cy_users') || '[]');
  const user = users.find(u => u.phone === session.phone);
  const newNick = prompt('修改昵称:', user?.nickname || session?.nickname || '');
  if(newNick === null) return;
  if(user) user.nickname = newNick;
  if(session) session.nickname = newNick;
  localStorage.setItem('cy_users', JSON.stringify(users));
  localStorage.setItem('cy_session', JSON.stringify(session));
  loadProfile();
  showToast('昵称已更新');
}
function openSettings(){
  showToast('设置功能开发中...');
}
function showAbout(){
  alert('🌿 彩云智药 v1.0\\n家庭AI药师智能体\\n让用药更安全');
}
function logout(){
  if(confirm('确定要退出登录吗？')){
    localStorage.removeItem('cy_session');
    showToast('已退出登录');
    setTimeout(() => location.reload(), 1000);
  }
}`;

const newProfileFunctions = `// ===== 我的页面 (Modal 版) =====
function openProfile(){
  switchTab('profile');
  loadProfile();
}
function loadProfile(){
  const session = JSON.parse(localStorage.getItem('cy_session') || '{}');
  const users = JSON.parse(localStorage.getItem('cy_users') || '[]');
  const user = users.find(u => u.phone === session.phone);
  const nickEl = document.getElementById('profileNicknameDisplay');
  const phoneEl = document.getElementById('profilePhoneDisplay');
  const editBtn = document.getElementById('profileEditBtn');
  const logoutBtn = document.getElementById('profileLogoutBtn');
  if(!session.phone){
    if(nickEl) nickEl.textContent = '未登录';
    if(phoneEl) phoneEl.textContent = '点击登录';
    if(editBtn) editBtn.textContent = t('login') || '🔐 登录';
    if(logoutBtn) logoutBtn.style.display = 'none';
  } else {
    if(nickEl) nickEl.textContent = user?.nickname || session?.nickname || '用户';
    if(phoneEl) phoneEl.textContent = user?.phone || session?.phone || '-';
    if(editBtn) editBtn.textContent = t('profileEdit') || '编辑资料';
    if(logoutBtn) logoutBtn.style.display = '';
  }
}
function t(key){
  const lang = localStorage.getItem('lang') || 'zh';
  return (T[lang] && T[lang][key]) || T.zh[key] || key;
}
function editProfile(){
  const session = JSON.parse(localStorage.getItem('cy_session') || '{}');
  if(!session.phone){
    // 未登录 → 打开登录 Modal
    openAuthModal('login');
    return;
  }
  // 已登录 → 打开编辑 Modal
  const users = JSON.parse(localStorage.getItem('cy_users') || '[]');
  const user = users.find(u => u.phone === session.phone);
  const nickInput = document.getElementById('profileEditNickname');
  const phoneInput = document.getElementById('profileEditPhone');
  if(nickInput) nickInput.value = user?.nickname || session?.nickname || '';
  if(phoneInput) phoneInput.value = user?.phone || session?.phone || '';
  const modal = document.getElementById('profileEditModal');
  if(modal) modal.style.display = 'flex';
}
function closeProfileModal(){
  const modal = document.getElementById('profileEditModal');
  if(modal) modal.style.display = 'none';
}
function saveProfileEdit(){
  const session = JSON.parse(localStorage.getItem('cy_session') || '{}');
  const users = JSON.parse(localStorage.getItem('cy_users') || '[]');
  const user = users.find(u => u.phone === session.phone);
  const nickInput = document.getElementById('profileEditNickname');
  const newNick = nickInput ? nickInput.value.trim() : '';
  if(!newNick){
    showToast('昵称不能为空');
    return;
  }
  if(user) user.nickname = newNick;
  if(session) session.nickname = newNick;
  localStorage.setItem('cy_users', JSON.stringify(users));
  localStorage.setItem('cy_session', JSON.stringify(session));
  loadProfile();
  closeProfileModal();
  showToast('保存成功');
}
function openSettings(){
  showToast('设置功能开发中...');
}
function showAbout(){
  const modal = document.getElementById('profileEditModal');
  if(modal){
    // 复用 Modal 显示关于信息
    document.getElementById('profileEditTitle').textContent = '🌿 关于我们';
    document.getElementById('profileEditNicknameLabel').parentElement.style.display = 'none';
    document.getElementById('profileEditPhoneLabel').parentElement.style.display = 'none';
    document.getElementById('profileEditSave').style.display = 'none';
    document.getElementById('profileEditCancel').textContent = '关闭';
    modal.style.display = 'flex';
    // 显示关于信息
    const content = document.createElement('div');
    content.id = 'aboutContent';
    content.style.cssText = 'text-align:center;padding:20px 0;line-height:1.8;font-size:14px;color:var(--text-primary)';
    content.innerHTML = '🌿 彩云智药 v1.0<br><br>家庭AI药师智能体<br>让用药更安全<br><br>基于 992 种常见药品数据<br>和中医辨证引擎';
    const oldContent = document.getElementById('aboutContent');
    if(oldContent) oldContent.remove();
    document.querySelector('#profileEditModal .modal-content').insertBefore(content, document.querySelector('#profileEditModal .modal-content > div:last-child'));
  }
}
function logout(){
  // 自定义确认 Modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = 'display:flex;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center';
  modal.innerHTML = \`<div style="max-width:300px;background:var(--card-bg,#fff);border-radius:12px;padding:24px;text-align:center">
    <div style="font-size:16px;font-weight:600;margin-bottom:12px;color:var(--text-primary)">退出登录</div>
    <div style="font-size:14px;color:var(--text-secondary);margin-bottom:20px">确定要退出登录吗？</div>
    <div style="display:flex;gap:10px">
      <button onclick="this.closest('.modal').remove()" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer">取消</button>
      <button id="confirmLogout" style="flex:1;padding:10px;background:#e74c3c;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:500">退出</button>
    </div>
  </div>\`;
  document.body.appendChild(modal);
  document.getElementById('confirmLogout').onclick = function(){
    localStorage.removeItem('cy_session');
    modal.remove();
    showToast('已退出登录');
    setTimeout(() => location.reload(), 800);
  };
}

// ===== 登录/注册 =====
let _authMode = 'login';
function openAuthModal(mode){
  _authMode = mode || 'login';
  const modal = document.getElementById('authModal');
  if(!modal) return;
  const title = document.getElementById('authTitle');
  const nickField = document.getElementById('authNicknameField');
  const errorEl = document.getElementById('authError');
  if(title) title.textContent = _authMode === 'login' ? '🔐 登录' : '📝 注册';
  if(nickField) nickField.style.display = _authMode === 'register' ? 'block' : 'none';
  if(errorEl) errorEl.style.display = 'none';
  // 清空输入
  ['authPhone','authPwd','authNickname'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = '';
  });
  modal.style.display = 'flex';
  setTimeout(() => { const el = document.getElementById('authPhone'); if(el) el.focus(); }, 100);
}
function closeAuthModal(){
  const modal = document.getElementById('authModal');
  if(modal) modal.style.display = 'none';
}
function showAuthError(msg){
  const errorEl = document.getElementById('authError');
  if(errorEl){
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }
}
function doLogin(){
  const phone = (document.getElementById('authPhone')?.value || '').trim();
  const pwd = document.getElementById('authPwd')?.value || '';
  if(!/^1[3-9]\\d{9}$/.test(phone)){ showAuthError('请输入正确的11位手机号'); return; }
  if(!pwd || pwd.length < 6){ showAuthError('密码至少6位'); return; }
  const users = JSON.parse(localStorage.getItem('cy_users') || '[]');
  const user = users.find(u => u.phone === phone);
  if(!user){ showAuthError('该手机号未注册，请先注册'); return; }
  if(user.pwd !== pwd){ showAuthError('密码错误'); return; }
  const session = { phone: user.phone, nickname: user.nickname, loginAt: Date.now() };
  localStorage.setItem('cy_session', JSON.stringify(session));
  closeAuthModal();
  showToast('登录成功');
  loadProfile();
}
function doRegister(){
  const phone = (document.getElementById('authPhone')?.value || '').trim();
  const pwd = document.getElementById('authPwd')?.value || '';
  const nick = (document.getElementById('authNickname')?.value || '').trim() || '用户' + phone.slice(-4);
  if(!/^1[3-9]\\d{9}$/.test(phone)){ showAuthError('请输入正确的11位手机号'); return; }
  if(!pwd || pwd.length < 6){ showAuthError('密码至少6位'); return; }
  const users = JSON.parse(localStorage.getItem('cy_users') || '[]');
  if(users.find(u => u.phone === phone)){ showAuthError('该手机号已注册，请直接登录'); return; }
  users.push({ phone, pwd, nickname: nick, createdAt: Date.now() });
  localStorage.setItem('cy_users', JSON.stringify(users));
  const session = { phone, nickname: nick, loginAt: Date.now() };
  localStorage.setItem('cy_session', JSON.stringify(session));
  closeAuthModal();
  showToast('注册成功，已自动登录');
  loadProfile();
}
function switchAuthMode(){
  _authMode = _authMode === 'login' ? 'register' : 'login';
  openAuthModal(_authMode);
}`;

if (s.indexOf(oldProfileFunctions) >= 0) {
  s = s.replace(oldProfileFunctions, newProfileFunctions);
  console.log('✅ Profile 函数已重写');
} else {
  console.log('⚠️ 旧函数未找到');
  // 调试：找部分内容
  const idx = s.indexOf('===== 我的页面');
  if (idx >= 0) {
    console.log('找到 我的页面 @:', idx, ':', s.slice(idx, idx + 200));
  }
}

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
