const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 提取 applyLang 函数体（不含函数头和结尾括号）
const afS = s.indexOf('function applyLang');
const afB = s.indexOf('{', afS);
let dd = 0, afEnd = afB;
for (let i = afB; i < s.length; i++) {
  if (s[i] === '{') dd++;
  else if (s[i] === '}') { dd--; if (!dd) { afEnd = i + 1; break; } }
}
const fn = s.slice(afS, afEnd);
console.log('applyLang 长度:', fn.length, '字节');

// 检查是否有 auth 相关更新
const authTerms = ['authTitle', 'authSub', 'authTabLogin', 'authTabRegister', 'authPhonePh', 'authPwdPh', 'authPwd2Ph', 'authSubmitBtn', 'authSkipBtn'];
authTerms.forEach(t => {
  const p = fn.indexOf(t);
  console.log('  ' + t + ':', p >= 0 ? '✅ 存在 @' + p : '❌ 缺失');
});

// 检查 T.auth 是否存在
const tAuth = s.indexOf('authTitle:');
console.log('\nT.authTitle:', tAuth >= 0 ? '✅ 存在 @' + tAuth : '❌ 缺失');
// 检查 en.authTitle
const enPart = s.indexOf('en:', s.indexOf('var T') + 10);
const enAuth = enPart >= 0 ? s.slice(enPart, enPart + 2000).indexOf('authTitle:') : -1;
console.log('T.en.authTitle:', enAuth >= 0 ? '✅ 存在' : '❌ 缺失');

// 检查 currentLang 默认值
const cl = s.indexOf('var currentLang');
const clEnd = s.indexOf(';', cl);
console.log('\ncurrentLang 定义:', s.slice(cl, clEnd + 1));

// 检查 applyLang 末尾的顺序（auth 应用在什么位置）
const lastAuth = Math.max(...authTerms.map(t => fn.lastIndexOf(t)));
console.log('\napplyLang 中最后一个 auth 元素:', lastAuth > 0 ? '✅ @' + lastAuth : '❌ 无');

// 查找 applyLang 末尾的 console.log
const doneLog = fn.indexOf("console.log('applyLang: DONE");
console.log('applyLang DONE 日志:', doneLog >= 0 ? '✅ @' + doneLog : '❌ 缺失');
if (doneLog >= 0) {
  console.log('末尾200字节:', fn.slice(-200));
}

process.exit(0);
