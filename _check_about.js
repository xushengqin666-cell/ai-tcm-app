const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
// 找所有 profileAbout 位置
let pos = 0;
while (true) {
  const idx = s.indexOf("profileAbout:'", pos);
  if (idx < 0) break;
  console.log('@' + idx + ':', s.slice(idx, idx + 50));
  pos = idx + 1;
}
