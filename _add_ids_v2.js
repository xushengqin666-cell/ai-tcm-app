const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 根据实际 HTML 结构添加 ID
const replacements = [
  // 症状搜药输入框
  { 
    find: 'id="symptomInput" type="text"', 
    replace: 'id="homeSymptomInput" type="text"'
  },
  // 药品说明书查询标题
  {
    find: '📋 药品说明书查询</span></div>',
    replace: '📋 药品说明书查询</span></div>'  // 标题已有 id="manualTitle"，检查
  },
  // 药品说明书输入框
  {
    find: 'id="drugManualInput"',
    replace: 'id="manualInput"'
  },
  // 药品说明书查询按钮
  {
    find: 'id="drugManualBtn"',
    replace: 'id="manualBtn"'
  },
  // 药箱表单输入框
  {
    find: 'id="cabinetDrugName"',
    replace: 'id="cabNameInput"'
  },
  {
    find: 'id="cabinetDrugSpec"',
    replace: 'id="cabSpecInput"'
  },
  {
    find: 'id="cabinetDrugQty"',
    replace: 'id="cabQtyInput"'
  },
  // 舌象选择器
  {
    find: 'id="tongue"',
    replace: 'id="tongueSelect"'
  },
  // 脉象选择器
  {
    find: 'id="pulse"',
    replace: 'id="pulseSelect"'
  }
];

let count = 0;
replacements.forEach(r => {
  if (s.indexOf(r.find) >= 0) {
    s = s.replace(r.find, r.replace);
    count++;
    console.log('✅', r.find);
  } else {
    console.log('⚠️ 未找到:', r.find);
  }
});

fs.writeFileSync('index.html', s, 'utf8');
console.log('\n总计替换:', count, '处');
console.log('文件大小:', s.length);
