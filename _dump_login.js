const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const dump = s.slice(540200, 540800).replace(/</g, '<');
console.log(dump);
process.exit(0);
