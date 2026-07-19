const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
const idx = s.indexOf('id=authGate');
if (idx >= 0) {
  console.log('found @', idx);
  console.log(s.slice(idx - 50, idx + 500));
} else {
  // 找 authGate 开始
  const idx2 = s.indexOf('<div id="authGate"');
  console.log('<div id="authGate" @', idx2);
  if (idx2 >= 0) {
    console.log(s.slice(idx2, idx2 + 3000));
  }
}
