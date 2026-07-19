const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const i = s.indexOf('// 辨证报告生成');
console.log(s.slice(i, i + 1400));
