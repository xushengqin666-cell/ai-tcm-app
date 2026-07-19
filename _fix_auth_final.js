const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
const RN = '\r\n';
let fixed = 0;

// 1) authPhonePh: 去掉重复的 id="authPhone"，保留 id="authPhonePh"
const dupPhone = 'id="authPhone" type="tel" inputmode="numeric" maxlength="11" placeholder="手机号" id="authPhonePh"';
const fixPhone = 'id="authPhone" type="tel" inputmode="numeric" maxlength="11" placeholder="手机号" id="authPhonePh"';
// 已经是正确状态了，但检查是否有 id="authPhone" + placeholder="手机号" + id="authPhonePh" 重复
const cntPhone = (s.match(/id="authPhonePh"/g)||[]).length;
if (cntPhone > 1) {
  console.log('❌ authPhonePh 重复(' + cntPhone + ')');
}
// 如果有 placeholder 在两个地方，合并
const phoneAnchor = 'inputmode="numeric" maxlength="11" placeholder="手机号" id="authPhonePh"';
const phoneAnchorOld = 'inputmode="numeric" maxlength="11" placeholder="手机号" id="authPhone" type="tel" inputmode="numeric" maxlength="11" placeholder="手机号" id="authPhonePh"';
if (s.includes(phoneAnchorOld)) {
  s = s.replace(phoneAnchorOld, phoneAnchor);
  fixed++;
  console.log('✅ 修复 authPhonePh 重复ID');
} else {
  console.log('authPhonePh 状态:', s.includes('id="authPhonePh"') ? '有ID ✅' : '缺ID ❌');
}

// 2) authPwdPh: 同样处理
const pwdAnchorOld = 'input id="authPwd" type="password" placeholder="密码（6 位以上）" id="authPwdPh"';
const pwdAnchor = 'id="authPwd" type="password" placeholder="密码（6 位以上）" id="authPwdPh"';
if (s.includes(pwdAnchorOld)) {
  s = s.replace(pwdAnchorOld, pwdAnchor);
  fixed++;
  console.log('✅ 修复 authPwdPh');
}

// 3) authPwd2Ph
const pwd2AnchorOld = 'input id="authPwd2" type="password" placeholder="确认密码" id="authPwd2Ph"';
const pwd2Anchor = 'id="authPwd2" type="password" placeholder="确认密码" id="authPwd2Ph"';
if (s.includes(pwd2AnchorOld)) {
  s = s.replace(pwd2AnchorOld, pwd2Anchor);
  fixed++;
  console.log('✅ 修复 authPwd2Ph');
}

// 4) authSubmitBtn: onclick 后面缺空格 → onclick="cyAuthSubmit()" id="authSubmitBtn"
const submitOld = 'onclick="cyAuthSubmit()"id="authSubmitBtn">登 录</button>';
const submitNew = 'onclick="cyAuthSubmit()" id="authSubmitBtn">登 录</button>';
const cntSubmit = s.split(submitOld).length - 1;
console.log('authSubmitBtn 缺空格:', cntSubmit, '次');
if (cntSubmit >= 1) {
  s = s.replace(submitOld, submitNew);
  fixed++;
  console.log('✅ 修复 authSubmitBtn 空格');
}

// 5) authSkipBtn: onclick 后面缺空格
const skipOld = 'onclick="cyAuthSkip()"id="authSkipBtn">先体验，跳过 →</div>';
const skipNew = 'onclick="cyAuthSkip()" id="authSkipBtn">先体验，跳过 →</div>';
const cntSkip = s.split(skipOld).length - 1;
console.log('authSkipBtn 缺空格:', cntSkip, '次');
if (cntSkip >= 1) {
  s = s.replace(skipOld, skipNew);
  fixed++;
  console.log('✅ 修复 authSkipBtn 空格');
}

// 验证所有 ID 正确
const ids = ['authTitle','authSub','authTabLogin','authTabRegister','authPhonePh','authPwdPh','authPwd2Ph','authSubmitBtn','authSkipBtn'];
let allOk = true;
ids.forEach(id => {
  const p = s.indexOf('id="' + id + '"');
  if (p < 0) { console.log('❌ ' + id + ' 缺失'); allOk = false; }
});
if (allOk) console.log('✅ 所有 auth ID 就位');

// 验证空格
if (!s.includes('onclick="cyAuthSubmit()" id="authSubmitBtn"')) {
  console.log('❌ authSubmitBtn 空格仍缺失'); allOk = false;
}
if (!s.includes('onclick="cyAuthSkip()" id="authSkipBtn"')) {
  console.log('❌ authSkipBtn 空格仍缺失'); allOk = false;
}

if (allOk) {
  fs.writeFileSync('index.html', s, 'utf8');
  console.log('🎉 auth HTML 修复完成，文件大小:', s.length, '(' + fixed + '处修复)');
} else {
  console.log('❌ 还有问题未修复');
  process.exit(1);
}
