const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
let fixed = 0;

// ===== A) 清理重复 ID =====
// 当前坏状态: id="authPhone" type="tel" inputmode="numeric" maxlength="11" placeholder="手机号" id="authPhonePh"
// 正确状态: type="tel" inputmode="numeric" maxlength="11" placeholder="手机号" id="authPhonePh"  (去掉重复的 id="authPhone")
const badPhone = 'id="authPhone" type="tel" inputmode="numeric" maxlength="11" placeholder="手机号" id="authPhonePh"';
const goodPhone = 'type="tel" inputmode="numeric" maxlength="11" placeholder="手机号" id="authPhonePh"';
const cntP = s.split(badPhone).length - 1;
console.log('phone 重复:', cntP);
if (cntP >= 1) { s = s.replace(badPhone, goodPhone); fixed++; console.log('✅ phone 修复'); }

// 密码同理: id="authPwd" type="password" placeholder="密码（6 位以上）" id="authPwdPh"
// 正确: id="authPwd" type="password" placeholder="密码（6 位以上）" id="authPwdPh" (去掉第一个id，保留第二个)
const badPwd = 'id="authPwd" type="password" placeholder="密码（6 位以上）" id="authPwdPh"';
const goodPwd = 'id="authPwd" type="password" placeholder="密码（6 位以上）" id="authPwdPh"';
// 实际上：去掉 id="authPwd" 重复，保留 authPwdPh
const badPwdFix = 'id="authPwd" type="password" placeholder="密码（6 位以上）" id="authPwdPh"';
const goodPwdFix = 'type="password" placeholder="密码（6 位以上）" id="authPwdPh"';
const cntPd = s.split(badPwdFix).length - 1;
console.log('pwd 重复:', cntPd);
if (cntPd >= 1) { s = s.replace(badPwdFix, goodPwdFix); fixed++; console.log('✅ pwd 修复'); }

// 确认密码: 可能正常（只有一个id）或重复
// 找 authPwd2Ph
const pwd2Match = s.match(/id="authPwd2"[^>]*id="authPwd2Ph"/g);
console.log('pwd2 重复:', pwd2Match ? pwd2Match[0] : '无');
if (pwd2Match) {
  // authPwd2Ph 是正确的，authPwd2 是多的
  const bad2 = 'id="authPwd2" type="password" placeholder="确认密码" id="authPwd2Ph"';
  const good2 = 'type="password" placeholder="确认密码" id="authPwd2Ph"';
  s = s.replace(bad2, good2);
  fixed++;
  console.log('✅ pwd2 修复');
}

// ===== B) 修复 onclick 缺空格 =====
const submitOld = 'onclick="cyAuthSubmit()"id="authSubmitBtn">登 录</button>';
const submitNew = 'onclick="cyAuthSubmit()" id="authSubmitBtn">登 录</button>';
const cntS = s.split(submitOld).length - 1;
console.log('submitBtn 缺空格:', cntS);
if (cntS >= 1) { s = s.replace(submitOld, submitNew); fixed++; console.log('✅ submitBtn 空格'); }

const skipOld = 'onclick="cyAuthSkip()"id="authSkipBtn">先体验，跳过 →</div>';
const skipNew = 'onclick="cyAuthSkip()" id="authSkipBtn">先体验，跳过 →</div>';
const cntSk = s.split(skipOld).length - 1;
console.log('skipBtn 缺空格:', cntSk);
if (cntSk >= 1) { s = s.replace(skipOld, skipNew); fixed++; console.log('✅ skipBtn 空格'); }

// ===== C) 验证 =====
const ids = ['authTitle','authSub','authTabLogin','authTabRegister','authPhonePh','authPwdPh','authPwd2Ph','authSubmitBtn','authSkipBtn'];
let ok = true;
ids.forEach(id => {
  const p = s.indexOf('id="' + id + '"');
  if (p < 0) { console.log('❌ ' + id + ' 缺失'); ok = false; return; }
  const cnt = (s.match(new RegExp('id="' + id + '"', 'g')) || []).length;
  if (cnt > 1) { console.log('❌ ' + id + ' 重复(' + cnt + ')'); ok = false; }
});
if (ok) console.log('✅ 所有 ID 正确且唯一');

const spaceOk = s.includes('onclick="cyAuthSubmit()" id="authSubmitBtn"') &&
                 s.includes('onclick="cyAuthSkip()" id="authSkipBtn"');
if (!spaceOk) { console.log('❌ 空格仍缺失'); ok = false; } else console.log('✅ onclick 空格正确');

if (ok) {
  fs.writeFileSync('index.html', s, 'utf8');
  console.log('🎉 完成，文件大小:', s.length, '(' + fixed + '处修复)');
} else {
  process.exit(1);
}
