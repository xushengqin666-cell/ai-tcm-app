const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const idx = s.indexOf('function doSearch()');
console.log(s.slice(idx, idx + 1400));
