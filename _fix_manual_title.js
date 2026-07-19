const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 把 manualCardTitle 改为 manualTitle
if (s.indexOf('id="manualCardTitle"') >= 0) {
  s = s.replace('id="manualCardTitle"', 'id="manualTitle"');
  console.log('✅ manualCardTitle → manualTitle');
} else {
  console.log('⚠️ manualCardTitle 未找到');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
