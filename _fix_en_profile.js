const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// T.en 中的 profile 键（目前还是中文）
const replacements = [
  ["navProfile:'我的'", "navProfile:'Profile'"],
  ["profileTitle:'👤 个人中心'", "profileTitle:'👤 Profile'"],
  ["profileNickname:'昵称'", "profileNickname:'Nickname'"],
  ["profilePhone:'手机号'", "profilePhone:'Phone'"],
  ["profileEdit:'编辑资料'", "profileEdit:'Edit Profile'"],
  ["profileSettings:'设置'", "profileSettings:'Settings'"],
  ["profileAbout:'关于我们'", "profileAbout:'About Us'"],
  ["profileLogout:'退出登录'", "profileLogout:'Logout'"],
];

replacements.forEach(([old, newVal]) => {
  if (s.indexOf(old) >= 0) {
    s = s.replace(old, newVal);
    console.log('✅', old, '→', newVal);
  } else {
    console.log('⚠️ 未找到:', old);
  }
});

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
