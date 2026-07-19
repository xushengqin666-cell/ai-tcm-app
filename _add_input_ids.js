const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 定义需要添加 ID 的元素（基于 placeholder 或上下文定位）
const replacements = [
  // 症状搜药输入框
  { 
    find: '<input type="text" id="symptomInput" placeholder="', 
    replace: '<input type="text" id="homeSymptomInput" placeholder="'
  },
  // 药品说明书查询标题
  {
    find: '<div class="section-title">📋 药品说明书查询</div>',
    replace: '<div class="section-title" id="manualTitle">📋 药品说明书查询</div>'
  },
  // 药品说明书输入框
  {
    find: '<input type="text" id="drugManualInput" placeholder="',
    replace: '<input type="text" id="manualInput" placeholder="'
  },
  // 药品说明书查询按钮
  {
    find: '<button id="drugManualBtn">查询</button>',
    replace: '<button id="manualBtn">查询</button>'
  },
  // 药箱表单输入框
  {
    find: '<input type="text" id="cabinetDrugName" placeholder="',
    replace: '<input type="text" id="cabNameInput" placeholder="'
  },
  {
    find: '<input type="text" id="cabinetDrugSpec" placeholder="',
    replace: '<input type="text" id="cabSpecInput" placeholder="'
  },
  {
    find: '<input type="number" id="cabinetDrugQty" placeholder="',
    replace: '<input type="number" id="cabQtyInput" placeholder="'
  },
  // 舌象选择器
  {
    find: '<select id="tongue">',
    replace: '<select id="tongueSelect">'
  },
  // 脉象选择器
  {
    find: '<select id="pulse">',
    replace: '<select id="pulseSelect">'
  },
  // 拍照识别按钮
  {
    find: '<button onclick="openDrugCamera()">拍照识别</button>',
    replace: '<button id="cameraBtn" onclick="openDrugCamera()">拍照识别</button>'
  }
];

let count = 0;
replacements.forEach(r => {
  if (s.indexOf(r.find) >= 0) {
    s = s.replace(r.find, r.replace);
    count++;
    console.log('✅', r.find.slice(0, 40) + '...');
  } else {
    console.log('⚠️ 未找到:', r.find.slice(0, 40) + '...');
  }
});

fs.writeFileSync('index.html', s, 'utf8');
console.log('\n总计替换:', count, '处');
console.log('文件大小:', s.length);
