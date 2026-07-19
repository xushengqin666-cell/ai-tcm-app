const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// sendChat 函数
const si = s.indexOf('function sendChat');
console.log('=== sendChat ===');
if (si >= 0) {
  let d = 0, k = s.indexOf('{', si);
  for (let e = k; e < s.length; e++) { if (s[e] === '{') { if (!d) { d = 1; k = e; } else d++; } else if (s[e] === '}') { d--; if (!d) { console.log(s.slice(si, e + 1)); break; } } }
}

// callAI 函数
const ci = s.indexOf('function callAI');
console.log('\n=== callAI ===');
if (ci >= 0) {
  let d = 0, k = s.indexOf('{', ci);
  for (let e = k; e < s.length; e++) { if (s[e] === '{') { if (!d) { d = 1; k = e; } else d++; } else if (s[e] === '}') { d--; if (!d) { console.log(s.slice(ci, e + 1).slice(0, 1500)); break; } } }
} else {
  // 可能是箭头/const callAI
  const ci2 = s.search(/callAI\s*=\s*async|const callAI|var callAI/);
  console.log('callAI 用 const/var 定义 @', ci2);
  if (ci2 >= 0) console.log(s.slice(ci2, ci2 + 1200));
}
