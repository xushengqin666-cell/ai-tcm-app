const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
const RN = '\r\n';

// 找错误注入锚点（placeholder 加了 ID 但丢失了后面的 >）
const badPh = s.indexOf('placeholder="手机号" id="authPhonePh">');
console.log('坏锚点:', badPh >= 0 ? '存在 ❌' : '不存在 ✅');
// 找正确锚点
const goodPh = s.indexOf('placeholder="手机号">');
console.log('好锚点 @' + goodPh + ':', goodPh >= 0 ? s.slice(goodPh - 20, goodPh + 30).replace(/</g, '<') : '不存在');

if (badPh >= 0) {
  // 修复：把错误注入的 ID 去掉，恢复正确锚点（placeholder 后直接是 >，无 ID）
  const old = 'placeholder="手机号" id="authPhonePh">';
  const nw = 'placeholder="手机号" id="authPhonePh">';
  // 实际上：旧锚点 = placeholder="手机号" id="authPhonePh">（这个本身就有问题，丢失了原来的 >）
  // 修复：替换为 placeholder="手机号" + id="authPhonePh" + >
  s = s.replace('placeholder="手机号" id="authPhonePh">', 'placeholder="手机号" id="authPhonePh">');
  // 等等，这个逻辑不对。我需要找到正确位置然后插入 ID。
  // 正确做法：把 "placeholder="手机号">" → "placeholder="手机号" id="authPhonePh">"
  // 因为旧的锚点把原来的 ">" 当作锚点的一部分了，所以现在 s 里已经是 "placeholder="手机号" id="authPhonePh">" 但这个 > 是旧的锚点尾巴，
  // 实际的 > 已经被吞了。所以需要检查 s 里的实际内容
  const actualBad = s.slice(goodPh >= 0 ? goodPh : badPh, (goodPh >= 0 ? goodPh : badPh) + 60);
  console.log('实际内容:', actualBad.replace(/</g, '<'));
}

// ===== 重新注入正确的 placeholder ID =====
// 先确认原始锚点
const ph1 = s.indexOf('placeholder="手机号">');
const ph2 = s.indexOf('placeholder="密码（6 位以上）">');
const ph3 = s.indexOf('placeholder="确认密码">');
console.log('\nplaceholder 锚点: 手机号@' + ph1 + ' 密码@' + ph2 + ' 确认@' + ph3);
if (ph1 < 0 || ph2 < 0 || ph3 < 0) { console.log('❌ 锚点缺失'); process.exit(1); }

// 替换为带 ID 的版本（保留原始 >）
const r1 = s.split('placeholder="手机号">').join('placeholder="手机号" id="authPhonePh">');
const r2 = r1.split('placeholder="密码（6 位以上）">').join('placeholder="密码（6 位以上）" id="authPwdPh">');
const r3 = r2.split('placeholder="确认密码">').join('placeholder="确认密码" id="authPwd2Ph">');
s = r3;

// 验证 ID 存在
const checkPh1 = s.indexOf('id="authPhonePh"');
const checkPh2 = s.indexOf('id="authPwdPh"');
const checkPh3 = s.indexOf('id="authPwd2Ph"');
console.log('ID 验证: phonePh@' + checkPh1 + ' pwdPh@' + checkPh2 + ' pwd2Ph@' + checkPh3);
if (checkPh1 < 0 || checkPh2 < 0 || checkPh3 < 0) { console.log('❌ ID 注入失败'); process.exit(1); }

console.log('✅ placeholder ID 修复完成');
fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
