const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const old = "var g = document.getElementById('authGate'); if(g) g.classList.add('show');";
let pos = 0;
for (let i = 0; i < 5; i++) {
  pos = s.indexOf(old, pos + 1);
  if (pos < 0) break;
  console.log('出现 ' + (i + 1) + ' @' + pos + ':', s.slice(Math.max(0, pos - 200), pos + old.length + 100).replace(/</g, '<').replace(/\n/g, '↵'));
}
process.exit(0);
