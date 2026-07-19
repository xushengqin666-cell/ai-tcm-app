const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 根据实际 HTML 结构添加 ID
const replacements = [
  // 药箱表单输入框
  { find: 'id="cabName"', replace: 'id="cabNameInput"' },
  { find: 'id="cabSpec"', replace: 'id="cabSpecInput"' },
  { find: 'id="cabQty"', replace: 'id="cabQtyInput"' },
  // 舌象脉象选择器
  { find: 'id="reportTongue"', replace: 'id="tongueSelect"' },
  { find: 'id="reportPulse"', replace: 'id="pulseSelect"' }
];

let count = 0;
replacements.forEach(r => {
  if (s.indexOf(r.find) >= 0) {
    s = s.replace(r.find, r.replace);
    count++;
    console.log('✅', r.find, '→', r.replace);
  } else {
    console.log('⚠️ 未找到:', r.find);
  }
});

fs.writeFileSync('index.html', s, 'utf8');
console.log('\n总计替换:', count, '处');
console.log('文件大小:', s.length);
