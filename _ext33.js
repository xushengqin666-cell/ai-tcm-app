const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

const cg = s.indexOf('function callGroqAPI');
console.log('=== callGroqAPI ===');
if (cg >= 0) {
  let d = 0, k = s.indexOf('{', cg);
  for (let e = k; e < s.length; e++) { if (s[e] === '{') { if (!d) { d = 1; k = e; } else d++; } else if (s[e] === '}') { d--; if (!d) { console.log(s.slice(cg, e + 1).slice(0, 1800)); break; } } }
} else {
  const cg2 = s.search(/callGroqAPI\s*=\s*(async\s+)?function|const callGroqAPI|var callGroqAPI/);
  console.log('callGroqAPI 用其他形式 @', cg2);
  if (cg2 >= 0) console.log(s.slice(cg2, cg2 + 1400));
}

// localFallback 实现
const lf = s.indexOf('function localFallback');
console.log('\n=== localFallback ===');
if (lf >= 0) console.log(s.slice(lf, lf + 700));
