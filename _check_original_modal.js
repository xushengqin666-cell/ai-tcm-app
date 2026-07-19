const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 查看原始 profileEditModal 的完整内容 (第一个)
let i = 0, c = 0;
while ((i = s.indexOf('id="profileEditModal"', i)) >= 0) {
  c++;
  console.log('\n==== ProfileEditModal #' + c + ' @' + i + ' ====');
  console.log(s.slice(i - 20, i + 1500));
  i++;
}
