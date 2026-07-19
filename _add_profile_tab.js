const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 1. 在底部导航添加"我的"按钮（在提醒后面）
const oldNavEnd = `<a href="javascript:void(0)" data-tab="reminder" onclick="openReminder()">⏰ <span id="navReminder">提醒</span></a>
</div>`;
const newNavEnd = `<a href="javascript:void(0)" data-tab="reminder" onclick="openReminder()">⏰ <span id="navReminder">提醒</span></a>
  <a href="javascript:void(0)" data-tab="profile" onclick="openProfile()">👤 <span id="navProfile">我的</span></a>
</div>`;

if (s.indexOf(oldNavEnd) >= 0) {
  s = s.replace(oldNavEnd, newNavEnd);
  console.log('✅ 底部导航"我的"已添加');
} else {
  console.log('⚠️ 底部导航模式未找到');
}

// 2. 在 T.zh 中添加翻译键
const zhInsert = "navReminder:'提醒',";
const zhNew = "navReminder:'提醒',navProfile:'我的',profileTitle:'👤 个人中心',profileNickname:'昵称',profilePhone:'手机号',profileEdit:'编辑资料',profileSettings:'设置',profileAbout:'关于我们',profileLogout:'退出登录',";
if (s.indexOf(zhInsert) >= 0 && s.indexOf('navProfile') < 0) {
  s = s.replace(zhInsert, zhNew);
  console.log('✅ T.zh 我的页面翻译已添加');
} else {
  console.log('⚠️ T.zh 插入点未找到或已存在');
}

// 3. 在 T.en 中添加翻译键  
const enInsert = "navReminder:'Reminder',";
const enNew = "navReminder:'Reminder',navProfile:'Profile',profileTitle:'👤 Profile',profileNickname:'Nickname',profilePhone:'Phone',profileEdit:'Edit Profile',profileSettings:'Settings',profileAbout:'About',profileLogout:'Logout',";
if (s.indexOf(enInsert) >= 0 && s.indexOf('navProfile') < 0) {
  s = s.replace(enInsert, enNew);
  console.log('✅ T.en 我的页面翻译已添加');
} else {
  console.log('⚠️ T.en 插入点未找到或已存在');
}

// 4. 在 applyLang 中添加 navProfile
const oldApply = "if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;";
const newApply = "if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;if(el=document.getElementById('navProfile')) el.textContent = t.navProfile;";
if (s.indexOf(oldApply) >= 0 && s.indexOf('navProfile') < 0) {
  s = s.replace(oldApply, newApply);
  console.log('✅ applyLang navProfile 已添加');
} else {
  console.log('⚠️ applyLang 插入点未找到');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
