const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
let i = 0, c = 0;
while ((i = s.indexOf('id="profileEditModal"', i)) >= 0) {
  console.log('Found #' + (++c) + ' @' + i + ':');
  console.log(s.slice(Math.max(0, i - 30), i + 80));
  i++;
}
console.log('Total:', c);

// 也检查 profileEditModal 和 closeProfileModal 函数是否一致
const closeFn = s.match(/function closeProfileModal[^}]+\}/s);
if (closeFn) {
  console.log('\ncloseProfileModal:', closeFn[0]);
}

// 检查外层 modal div 结构
const modalStart = s.indexOf('id="profileEditModal"');
if (modalStart > 0) {
  console.log('\nModal start context:');
  console.log(s.slice(Math.max(0, modalStart - 100), modalStart + 200));
}
