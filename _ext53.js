const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const i = s.indexOf('function runDrugOCR(');
let d=0, k=s.indexOf('{',i);
for(let e=k;e<s.length;e++){if(s[e]==='{'){if(!d){d=1;}else d++;}else if(s[e]==='}'){d--;if(!d){console.log(s.slice(i,e+1).replace(/</g,'⏊'));break;}}}
