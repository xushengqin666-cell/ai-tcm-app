const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找所有 script 块
let pos = 0;
for (let i = 0; i < 50; i++) {
  pos = s.indexOf('<script>', pos + 1);
  if (pos < 0) break;
  const end = s.indexOf('</script>', pos);
  const snippet = s.slice(pos, Math.min(pos + 100, end)).replace(/</g, '<');
  const len = end - pos;
  console.log('script @' + pos + ' (len=' + len + '): ' + snippet);
}
process.exit(0);
