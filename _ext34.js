const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

const cw = s.indexOf('function callWorker');
console.log('=== callWorker ===');
if (cw >= 0) {
  let d = 0, k = s.indexOf('{', cw);
  for (let e = k; e < s.length; e++) { if (s[e] === '{') { if (!d) { d = 1; k = e; } else d++; } else if (s[e] === '}') { d--; if (!d) { console.log(s.slice(cw, e + 1).slice(0, 1400)); break; } } }
} else console.log('不存在');

// callDashScope
const cds = s.indexOf('function callDashScope');
console.log('\n=== callDashScope ===');
if (cds >= 0) console.log(s.slice(cds, cds + 500));

// 找 WORKER_URL 使用点
console.log('\n=== WORKER_URL 使用 ===');
let from = 0, n = 0;
while ((from = s.indexOf('WORKER_URL', from)) >= 0 && n < 5) {
  console.log((n+1) + '. ' + s.slice(s.lastIndexOf('\n', from)+1, s.indexOf('\n', from)).trim().slice(0, 100));
  from += 10; n++;
}
