const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

const idx = s.indexOf("getElementById('reportGenerateBtn')");
console.log('idx:', idx);
// 往前找函数起点
let start = s.lastIndexOf('function', idx);
if (start < 0) start = s.lastIndexOf('var ', idx) - 4;
console.log(s.slice(start, idx + 600));
