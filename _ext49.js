const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

function show(fn, len) {
  const i = s.indexOf('function ' + fn);
  if (i < 0) { console.log('❌ ' + fn + ' 不存在'); return; }
  let d = 0, k = s.indexOf('{', i);
  for (let e = k; e < s.length; e++) {
    if (s[e] === '{') { if (!d) { d = 1; k = e; } else d++; }
    else if (s[e] === '}') { d--; if (!d) { console.log('=== ' + fn + ' (@' + i + ') ===\n' + s.slice(i, e + 1).slice(0, len) + '\n'); return; } }
  }
}

show('openDrugCamera', 1200);
show('openManualInput', 1200);

// Tesseract 用法
const ti = s.indexOf('Tesseract');
console.log('\n=== Tesseract 引用 (@' + ti + ') ===');
console.log(s.slice(ti - 50, ti + 400));
