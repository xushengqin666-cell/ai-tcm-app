const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 找所有 </style> 的位置
let i = 0, c = 0;
while ((i = s.indexOf('</style>', i)) >= 0) {
  console.log('</style> #' + (++c) + ' @' + i + ':');
  console.log(s.slice(Math.max(0, i - 100), i + 50));
  i += 8;
}
console.log('Total:', c);

console.log('\n\n=== <style> 位置 ===');
let j = 0, c2 = 0;
while ((j = s.indexOf('<style>', j)) >= 0) {
  console.log('<style> #' + (++c2) + ' @' + j + ':');
  console.log(s.slice(Math.max(0, j - 50), j + 50));
  j += 7;
}
console.log('Total:', c2);
