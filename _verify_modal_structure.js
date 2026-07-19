const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
const idx = s.indexOf('id="profileEditModal"');
console.log(s.slice(Math.max(0, idx - 60), idx + 2000));
