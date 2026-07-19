const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 在 T.en 的 navReminder 后面插入 profile 相关键
const oldStr = "navHome:'Home',navInsert:'Manual',navCabinet:'Cabinet',navMember:'Family',navReminder:'Reminder',\r\n    // AI Config Panel";
const newStr = "navHome:'Home',navInsert:'Manual',navCabinet:'Cabinet',navMember:'Family',navReminder:'Reminder',navProfile:'Profile',\r\n    // Profile\r\n    profileTitle:'👤 Profile',profileNickname:'Nickname',profilePhone:'Phone',profileEdit:'Edit Profile',profileSettings:'Settings',profileAbout:'About Us',profileLogout:'Logout',\r\n    // AI Config Panel";
if (s.indexOf(oldStr) >= 0) {
  s = s.replace(oldStr, newStr);
  console.log('✅ T.en profile 键已添加');
} else {
  console.log('⚠️ 插入点未找到（尝试 LF）');
  const oldStr2 = "navHome:'Home',navInsert:'Manual',navCabinet:'Cabinet',navMember:'Family',navReminder:'Reminder',\n    // AI Config Panel";
  if (s.indexOf(oldStr2) >= 0) {
    s = s.replace(oldStr2, newStr.replace(/\r\n/g, '\n'));
    console.log('✅ T.en profile 键已添加 (LF)');
  } else {
    console.log('❌ 未找到插入点');
  }
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
