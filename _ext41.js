const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const i = s.indexOf('if(plan.herbs && plan.herbs.length)');
console.log(s.slice(i, i + 900));
