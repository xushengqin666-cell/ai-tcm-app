const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
const enIdx = s.indexOf("navHome:'Home'");
console.log(s.slice(enIdx - 20, enIdx + 500));
