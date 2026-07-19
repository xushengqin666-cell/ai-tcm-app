const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const p = s.indexOf('id="authGate"');
console.log('authGate HTML @' + p + ':', s.slice(p, p + 150).replace(/</g, '<'));
process.exit(0);
