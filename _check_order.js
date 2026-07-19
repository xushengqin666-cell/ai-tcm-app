const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
// 找 authGate 主体位置
const ag = s.indexOf('id="authGate"');
console.log('authGate @' + ag + ':', s.slice(ag, ag + 200).replace(/</g, '<').replace(/\n/g, ' '));
// 找 authTitle
const at = s.indexOf('id="authTitle"');
console.log('\nauthTitle @' + at + ':', at >= 0 ? s.slice(at - 5, at + 60).replace(/</g, '<').replace(/\n/g, ' ') : '不存在');
// 找主脚本块
const ms = s.indexOf('<script>/* ===== 彩云智药');
console.log('\n主脚本块 @' + ms + ':', s.slice(ms, ms + 60).replace(/</g, '<'));
// 找 applyLang 函数定义
const af = s.indexOf('function applyLang');
console.log('\napplyLang @' + af);
// 找 cyAuthSubmit
const cyA = s.indexOf('cyAuthSubmit');
console.log('\ncyAuthSubmit @' + cyA + ':', s.slice(cyA, cyA + 150).replace(/</g, '<').replace(/\n/g, ' '));
// 找 authMode
const am = s.indexOf('__authMode');
console.log('\n__authMode @' + am + ':', s.slice(am, am + 150).replace(/</g, '<').replace(/\n/g, ' '));
process.exit(0);
