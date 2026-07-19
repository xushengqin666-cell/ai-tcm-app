const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

function extractFn(name) {
  const i = s.indexOf('function ' + name);
  if (i < 0) return;
  let d = 0, k = s.indexOf('{', i);
  for (let e = k; e < s.length; e++) {
    if (s[e] === '{') { if (!d) { d = 1; } else d++; }
    else if (s[e] === '}') { d--; if (!d) { return s.slice(i, e + 1); } }
  }
}

// T 对象
const ti = 48906;
let d = 0, k = s.indexOf('{', ti);
let te = -1;
for (let e = k; e < s.length; e++) {
  if (s[e] === '{') { if (!d) { d = 1; } else d++; }
  else if (s[e] === '}') { d--; if (!d) { te = e; break; } }
}
const Tobj = s.slice(ti, te + 1);
console.log('=== T 对象大小:', Tobj.length, '字节 ===');
// 提取所有 key
const keys = [...Tobj.matchAll(/'([a-zA-Z_][a-zA-Z0-9_]*)'\s*:\s*'([^']*)'/g)].map(m => m[1]);
console.log('T 现有 key 数:', keys.length);
console.log('keys:', keys.join(', '));
// 看 applyLang
console.log('\n=== applyLang ===');
console.log(extractFn('applyLang').replace(/</g,'⏊'));
