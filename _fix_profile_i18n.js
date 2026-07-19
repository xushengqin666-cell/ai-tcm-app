const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 1. 添加 profileTitle 到 applyLang
const oldApply = "if(el=document.getElementById('navProfile')) el.textContent = t.navProfile;";
const newApply = "if(el=document.getElementById('navProfile')) el.textContent = t.navProfile;if(el=document.getElementById('profileTitle')) el.textContent = t.profileTitle;";
if (s.indexOf(oldApply) >= 0) {
  s = s.replace(oldApply, newApply);
  console.log('✅ applyLang profileTitle 已添加');
} else {
  console.log('⚠️ applyLang 插入点未找到');
}

// 2. 添加其他 profile 元素的翻译
const oldApply2 = "if(el=document.getElementById('profileTitle')) el.textContent = t.profileTitle;";
const newApply2 = `if(el=document.getElementById('profileTitle')) el.textContent = t.profileTitle;
if(el=document.getElementById('profileEditBtn')) el.textContent = t.profileEdit;
if(el=document.getElementById('profileSettingsBtn')) el.textContent = t.profileSettings;
if(el=document.getElementById('profileAboutBtn')) el.textContent = t.profileAbout;
if(el=document.getElementById('profileLogoutBtn')) el.textContent = t.profileLogout;`;
if (s.indexOf(oldApply2) >= 0 && s.indexOf('profileEditBtn') < 0) {
  s = s.replace(oldApply2, newApply2);
  console.log('✅ applyLang profile 按钮已添加');
}

// 3. 给按钮添加 ID
const btnPatterns = [
  { old: 'onclick="editProfile()" style="width:100%;margin-bottom:10px">编辑资料</button>', new: 'id="profileEditBtn" onclick="editProfile()" style="width:100%;margin-bottom:10px">编辑资料</button>' },
  { old: 'onclick="openSettings()" style="width:100%;margin-bottom:10px">设置</button>', new: 'id="profileSettingsBtn" onclick="openSettings()" style="width:100%;margin-bottom:10px">设置</button>' },
  { old: 'onclick="showAbout()" style="width:100%;margin-bottom:10px">关于我们</button>', new: 'id="profileAboutBtn" onclick="showAbout()" style="width:100%;margin-bottom:10px">关于我们</button>' },
  { old: 'onclick="logout()" style="width:100%">退出登录</button>', new: 'id="profileLogoutBtn" onclick="logout()" style="width:100%">退出登录</button>' }
];

btnPatterns.forEach(p => {
  if (s.indexOf(p.old) >= 0) {
    s = s.replace(p.old, p.new);
    console.log('✅ 按钮 ID 已添加');
  } else {
    console.log('⚠️ 按钮模式未找到');
  }
});

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
