const fs = require('fs');
const path = 'C:/Users/xu_fa/ai-tcm-app/index.html';
const s = fs.readFileSync(path, 'utf8');

// 找所有 applyLang 相关函数定义
const matches = [];
let pos = 0;
while (true) {
  const idx = s.indexOf('applyLang', pos);
  if (idx < 0) break;
  matches.push({ pos: idx, context: s.slice(idx - 5, idx + 50) });
  pos = idx + 1;
  if (matches.length > 5) break;
}
console.log('applyLang 出现位置:', matches);
