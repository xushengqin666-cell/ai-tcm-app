const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 1. 添加 Profile 编辑 Modal HTML (插入到 tab-profile 后面)
const profileModal = `
<!-- Profile 编辑 Modal -->
<div id="profileEditModal" class="modal" style="display:none">
  <div class="modal-content" style="max-width:340px;padding:24px;background:var(--card-bg,#fff);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.2);position:relative">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h3 id="profileEditTitle" style="margin:0;font-size:18px;color:var(--text-primary)">✏️ 编辑资料</h3>
      <button onclick="closeProfileModal()" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--text-secondary);padding:0;line-height:1">×</button>
    </div>
    <div style="margin-bottom:14px">
      <label id="profileEditNicknameLabel" style="display:block;margin-bottom:6px;font-size:13px;color:var(--text-secondary)">昵称</label>
      <input id="profileEditNickname" type="text" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:14px;box-sizing:border-box" placeholder="请输入昵称" maxlength="20">
    </div>
    <div style="margin-bottom:20px">
      <label id="profileEditPhoneLabel" style="display:block;margin-bottom:6px;font-size:13px;color:var(--text-secondary)">手机号</label>
      <input id="profileEditPhone" type="tel" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:14px;box-sizing:border-box" placeholder="请输入手机号" maxlength="11" disabled>
      <div id="profileEditPhoneHint" style="font-size:11px;color:#999;margin-top:4px">手机号不可修改</div>
    </div>
    <div style="display:flex;gap:10px">
      <button id="profileEditCancel" onclick="closeProfileModal()" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;color:var(--text-primary)">取消</button>
      <button id="profileEditSave" onclick="saveProfileEdit()" style="flex:1;padding:10px;background:var(--primary,#1aad19);color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:500">保存</button>
    </div>
  </div>
</div>
<!-- 登录/注册 Modal -->
<div id="authModal" class="modal" style="display:none">
  <div class="modal-content" style="max-width:340px;padding:24px;background:var(--card-bg,#fff);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.2);position:relative">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h3 id="authTitle" style="margin:0;font-size:18px;color:var(--text-primary)">🔐 登录</h3>
      <button onclick="closeAuthModal()" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--text-secondary);padding:0;line-height:1">×</button>
    </div>
    <div style="margin-bottom:14px">
      <label id="authPhoneLabel" style="display:block;margin-bottom:6px;font-size:13px;color:var(--text-secondary)">手机号</label>
      <input id="authPhone" type="tel" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:14px;box-sizing:border-box" placeholder="请输入11位手机号" maxlength="11">
    </div>
    <div style="margin-bottom:14px">
      <label id="authPwdLabel" style="display:block;margin-bottom:6px;font-size:13px;color:var(--text-secondary)">密码</label>
      <input id="authPwd" type="password" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:14px;box-sizing:border-box" placeholder="请输入密码" maxlength="32">
    </div>
    <div id="authNicknameField" style="margin-bottom:14px;display:none">
      <label id="authNicknameLabel" style="display:block;margin-bottom:6px;font-size:13px;color:var(--text-secondary)">昵称（选填）</label>
      <input id="authNickname" type="text" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:14px;box-sizing:border-box" placeholder="给自己起个名字" maxlength="20">
    </div>
    <div id="authError" style="display:none;color:#e74c3c;font-size:12px;margin-bottom:10px;text-align:center"></div>
    <div style="display:flex;gap:10px;margin-bottom:14px">
      <button id="authLoginBtn" onclick="doLogin()" style="flex:1;padding:10px;background:var(--primary,#1aad19);color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:500">登录</button>
      <button id="authRegisterBtn" onclick="doRegister()" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;color:var(--text-primary)">注册</button>
    </div>
    <div id="authSwitchTip" style="text-align:center;font-size:12px;color:var(--text-secondary)"></div>
  </div>
</div>
`;

// 2. 在 tab-profile 后面插入
const insertPoint = '<!-- 我的 -->\n<div id="tab-profile"';
const idx = s.indexOf(insertPoint);
if (idx >= 0) {
  // 找到 tab-profile 的结束 </div>
  const tabStart = idx + '<!-- 我的 -->'.length;
  let depth = 0;
  let i = tabStart;
  let inTag = false;
  let inStr = null;
  while (i < s.length) {
    const c = s[i];
    if (inStr) {
      if (c === inStr) inStr = null;
    } else if (c === '"' || c === "'") {
      inStr = c;
    } else if (c === '<') {
      if (s[i+1] === '/') {
        // closing tag
        const tagEnd = s.indexOf('>', i);
        if (tagEnd > 0) {
          const tag = s.slice(i+2, tagEnd).trim().split(/\s+/)[0];
          // 简单匹配
        }
        i = tagEnd;
        continue;
      }
      inTag = true;
    } else if (c === '>') {
      inTag = false;
    }
    i++;
  }
  // 简化处理：直接找 <div id="tab-profile" 后的最外层 </div>
  const afterTab = s.indexOf('</div>\n</div>\n<!-- ', tabStart);
  if (afterTab > 0) {
    // 找到 tab-profile 后的第二个 </div>
    const endIdx = afterTab + '</div>'.length;
    s = s.slice(0, endIdx) + profileModal + s.slice(endIdx);
    console.log('✅ Modal HTML 已插入到 tab-profile 后');
  } else {
    console.log('⚠️ tab-profile 结束未找到,尝试其他位置');
    // 备用：在 bottom-nav 前插入
    const navIdx = s.indexOf('<div class="bottom-nav">');
    if (navIdx > 0) {
      s = s.slice(0, navIdx) + profileModal + '\n' + s.slice(navIdx);
      console.log('✅ Modal HTML 备用位置已插入 (bottom-nav 前)');
    }
  }
}

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
