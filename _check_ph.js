const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const p = s.indexOf('id="authPhonePh"');
console.log('authPhonePh ID:', p >= 0 ? '存在 @' + p : '缺失 ❌');
const p2 = s.indexOf('id="authPwdPh"');
console.log('authPwdPh ID:', p2 >= 0 ? '存在 @' + p2 : '缺失 ❌');
const p3 = s.indexOf('id="authPwd2Ph"');
console.log('authPwd2Ph ID:', p3 >= 0 ? '存在 @' + p3 : '缺失 ❌');
if (p >= 0) console.log('authPhonePh 上下文:', s.slice(Math.max(0, p - 40), p + 100).replace(/</g, '<'));
if (p < 0 || p2 < 0 || p3 < 0) {
  // 修复：找到 placeholder="xxx"> 替换为 placeholder="xxx" id="yyy">
  let ns = s;
  const fixes = [
    ['placeholder="手机号">', 'placeholder="手机号" id="authPhonePh">'],
    ['placeholder="密码（6 位以上）">', 'placeholder="密码（6 位以上）" id="authPwdPh">'],
    ['placeholder="确认密码">', 'placeholder="确认密码" id="authPwd2Ph">'],
  ];
  for (const [old, nw] of fixes) {
    const cnt = ns.split(old).length - 1;
    console.log('修复: ' + old + ' 出现' + cnt + '次');
    ns = ns.split(old).join(nw);
  }
  fs.writeFileSync('index.html', ns, 'utf8');
  console.log('✅ 修复写入，文件大小:', ns.length);
} else {
  console.log('✅ placeholder ID 已正确');
}
process.exit(0);
