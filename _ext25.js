const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找所有含 reportGenerateBtn 的行
const lines = s.split('\n');
lines.forEach((line, i) => {
  if (line.includes('reportGenerateBtn') && (line.includes('click') || line.includes('addEventListener') || line.includes('onclick'))) {
    console.log((i+1) + ': ' + line.trim().slice(0, 150));
  }
});

// 找 comprehensiveAnalysis 前后
const ca = s.indexOf('comprehensiveAnalysis');
console.log('\n=== comprehensiveAnalysis 上下文 ===');
console.log(s.slice(ca - 800, ca + 600));
