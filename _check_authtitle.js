const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
const idx = s.indexOf('modalAuthTitle');
console.log('modalAuthTitle @', idx);
const idx2 = s.indexOf('id="authTitle"');
console.log('id="authTitle" @', idx2, 'count:', (s.match(/id="authTitle"/g) || []).length);
if (idx2 > 0) {
  console.log('context:', s.slice(idx2 - 50, idx2 + 100));
}
