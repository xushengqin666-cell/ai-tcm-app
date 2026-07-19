const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 验证 zh 有 auth 键
const zhHasAuth = s.includes("authTitle:'彩云智药'");
const enHasAuth = s.includes("authTitle:'Caiyun Smart Pharmacy'");
console.log('T.zh authTitle:', zhHasAuth ? '✅' : '❌');
console.log('T.en authTitle:', enHasAuth ? '✅' : '❌');

// 找 T.en 的闭合括号（在 T.zh 之后）
const varT = s.indexOf('var T =');
const zhK = s.indexOf('zh:', varT);
// zh 对象范围
function mClose(str, open) {
  let dd = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === '{') dd++;
    else if (str[i] === '}') { dd--; if (!dd) return i; }
  }
  return -1;
}
const zhO = s.indexOf('{', zhK), zhC = mClose(s, zhO);
// T.en 在 zh 之后，找最近的 en:
const enK = s.indexOf("en:", zhK + 1);
const enO = s.indexOf('{', enK);
const enC = mClose(s, enO);
console.log('\nT.en 范围: @' + enO + ' ~ @' + enC);

// 提取 en 末尾内容
const enTail = s.slice(enC - 200, enC + 10);
console.log('T.en 末尾:', enTail.replace(/</g, '<').replace(/\n/g, '↵'));

// 找 T.en 的最后一个已知 key（在闭合 } 之前）
// 在 en 对象里找最后一个 key 的位置
const lastKey = "cabMemberNoAssign:'Not specified'";
const lastKeyPos = s.indexOf(lastKey, enO);
console.log('T.en 最后一个已知key @' + lastKeyPos);

// auth 键的英文版本（不带前缀）
const authEnKeys = "authTitle:'Caiyun Smart Pharmacy',authSub:'Family AI Pharmacist · Safer Medication',authTabLogin:'Log in',authTabRegister:'Register',authPhonePh:'Phone number',authPwdPh:'Password (6+ digits)',authPwd2Ph:'Confirm password',authSubmitBtn:'Log in',authSkipBtn:'Skip for now →'";

// 在 en 闭合 } 之前插入（直接在 'Not specified'' 后面加逗号+auth键）
// 找到 lastKey 的结束位置
const lastKeyEnd = lastKeyPos + lastKey.length;
console.log('\n插入位置 @' + lastKeyEnd + ': ' + s.slice(lastKeyEnd, lastKeyEnd + 50).replace(/\n/g, '↵'));

const before = s.slice(lastKeyEnd, lastKeyEnd + 5);
if (before.trim() !== ',') {
  // 需要加逗号
  s = s.slice(0, lastKeyEnd) + ',' + s.slice(lastKeyEnd);
  console.log('✅ 加了逗号');
}

const insPos = lastKeyEnd + (before.trim() !== ',' ? 1 : 0);
const insStr = "authTitle:'Caiyun Smart Pharmacy',authSub:'Family AI Pharmacist · Safer Medication',authTabLogin:'Log in',authTabRegister:'Register',authPhonePh:'Phone number',authPwdPh:'Password (6+ digits)',authPwd2Ph:'Confirm password',authSubmitBtn:'Log in',authSkipBtn:'Skip for now →'";
s = s.slice(0, insPos) + insStr + s.slice(insPos);
console.log('✅ auth 键已插入 T.en');

// 验证
const newEnHasAuth = s.includes("authTitle:'Caiyun Smart Pharmacy'");
console.log('\nT.en authTitle:', newEnHasAuth ? '✅ 成功' : '❌ 仍缺失');

if (newEnHasAuth) {
  fs.writeFileSync('index.html', s, 'utf8');
  console.log('🎉 写入完成，文件大小:', s.length);
} else {
  console.error('❌ 插入失败');
  process.exit(1);
}
