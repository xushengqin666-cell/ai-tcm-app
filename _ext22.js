const s = require('fs').readFileSync('index.html', 'utf8');
const ds = s.indexOf('function doSearch');
let depth = 0, i = ds, end = -1;
for (; i < s.length; i++) { if (s[i] === '{') depth++; else if (s[i] === '}') { depth--; if (!depth) { end = i + 1; break; } } }
console.log('doSearch full:');
console.log(s.slice(ds, end));
