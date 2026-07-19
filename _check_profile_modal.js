const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
const idx = s.indexOf('id="profileModal"');
if (idx > 0) {
  console.log(s.slice(idx, idx + 2500));
}
