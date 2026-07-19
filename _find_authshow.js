const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const contexts = [];
let pos = 0;
const end = 100000; // limit search to first 100KB (main script area)
for (let i = 0; i < 30; i++) {
  pos = s.indexOf('authGate', pos + 1);
  if (pos < 0 || pos > end) break;
  contexts.push(pos + ': ' + s.slice(Math.max(0, pos - 30), pos + 80).replace(/</g, '<').replace(/\n/g, '↵'));
}
console.log('authGate 出现 (' + contexts.length + '个):');
contexts.forEach(c => console.log(c));

// 找 startApp 附近的 auth 代码
const sa = s.indexOf('function startApp');
console.log('\nstartApp 函数体 @' + sa + ':');
console.log(s.slice(sa, sa + 800).replace(/</g, '<').replace(/\n/g, '↵'));
process.exit(0);
