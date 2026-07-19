const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

const profileFunctions = `
// ===== 我的页面 =====
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
}
`;

// 在 openReminder 函数后插入
const insertPattern = "function openReminder(){\r\n  switchTab('reminder');\r\n}";
const newPattern = insertPattern + profileFunctions;

if (s.indexOf(insertPattern) >= 0) {
  s = s.replace(insertPattern, newPattern);
  console.log('✅ Profile 函数已添加');
} else {
  console.log('⚠️ 插入点未找到，尝试其他模式');
  // 尝试 LF 版本
  const insertPattern2 = "function openReminder(){\n  switchTab('reminder');\n}";
  if (s.indexOf(insertPattern2) >= 0) {
    s = s.replace(insertPattern2, insertPattern2 + profileFunctions);
    console.log('✅ Profile 函数已添加 (LF)');
  } else {
    console.log('⚠️ LF 版本也未找到');
  }
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
