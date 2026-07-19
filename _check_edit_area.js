const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
// profileEditTitle 位置
const idx = s.indexOf('profileEditTitle');
console.log('profileEditTitle @', idx);
// 看前面 500 字符 (找到包含它的区块)
console.log('\n前 600 字符:');
console.log(s.slice(Math.max(0, idx - 600), idx + 800));
