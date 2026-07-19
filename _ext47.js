const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 1) Home 症状搜药：输入元素 + 触发方式
console.log('=== Home 症状搜药 ===');
// 找 symptomInput / symptomSearch 等
['symptomInput','symptomSearch','symptomSearchBtn','symSearch','symptInput'].forEach(id => {
  const i = s.indexOf('id="' + id + '"');
  if (i >= 0) console.log('  找到元素 id=' + id + ' @' + i);
});
// 找症状搜索的监听绑定（addEventListener 附近含 symptom）
let from = 0; const hits = [];
while ((from = s.toLowerCase().indexOf('symptom', from)) >= 0 && hits.length < 20) { hits.push(from); from += 8; }
console.log('  symptom 出现次数:', hits.length);

// 2) 相互作用：输入元素
console.log('\n=== 相互作用 ===');
['drugA','drugB','interactDrugA','interactDrugB','interactInput','interactBtn','checkInteract'].forEach(id => {
  const i = s.indexOf('id="' + id + '"');
  if (i >= 0) console.log('  找到元素 id=' + id + ' @' + i);
});

// 3) 拍照/手动输入按钮
console.log('\n=== 拍照/手动输入 ===');
['drugCameraBtn','manualInputBtn','cameraBtn','openManualInput','openDrugCamera'].forEach(id => {
  const i = s.indexOf('id="' + id + '"');
  if (i >= 0) console.log('  找到元素 id=' + id + ' @' + i);
});
// openManualInput / openDrugCamera 函数定义
['openManualInput','openDrugCamera'].forEach(fn => {
  const i = s.indexOf('function ' + fn);
  if (i >= 0) console.log('  函数 ' + fn + ' @' + i);
});
