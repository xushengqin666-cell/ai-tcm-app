const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

const profileTab = `
<!-- 我的 -->
<div id="tab-profile" class="tab-content">
  <div class="card">
    <div class="card-title" id="profileTitle">👤 个人中心</div>
    <div style="text-align:center;padding:20px 0">
      <div style="width:80px;height:80px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;margin:0 auto 15px;display:flex;align-items:center;justify-content:center;font-size:36px;color:#fff">👤</div>
      <div id="profileNicknameDisplay" style="font-size:18px;font-weight:600;color:var(--text-primary);margin-bottom:5px">-</div>
      <div id="profilePhoneDisplay" style="font-size:14px;color:var(--text-secondary)">-</div>
    </div>
    <div class="field" style="border-top:1px solid var(--border);padding-top:15px;margin-top:15px">
      <button class="btn-primary" id="profileEditBtn" onclick="editProfile()" style="width:100%;margin-bottom:10px">编辑资料</button>
      <button class="btn-secondary" id="profileSettingsBtn" onclick="openSettings()" style="width:100%;margin-bottom:10px">设置</button>
      <button class="btn-secondary" id="profileAboutBtn" onclick="showAbout()" style="width:100%;margin-bottom:10px">关于我们</button>
      <button class="btn-danger" id="profileLogoutBtn" onclick="logout()" style="width:100%">退出登录</button>
    </div>
  </div>
</div>
`;

// 在 tab-reminder 结束后插入
const insertPoint = '</div>\r\n<div class="bottom-nav">';
const newInsert = '</div>' + profileTab + '\r\n<div class="bottom-nav">';

if (s.indexOf(insertPoint) >= 0) {
  s = s.replace(insertPoint, newInsert);
  console.log('✅ tab-profile 已添加');
} else {
  console.log('⚠️ 插入点未找到');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
