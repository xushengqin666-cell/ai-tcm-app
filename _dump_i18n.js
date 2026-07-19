const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
function show(from, to) { console.log(s.slice(from, to).replace(/</g,'⏊')); }

// 1) tabCabinetBtn 上下文
console.log('=== @37100~37220 顶部药箱tab ===');
show(37100, 37220);

// 2) 症状搜药整卡
console.log('\n=== @37600~37800 症状搜药卡 ===');
show(37600, 37800);

// 3) 药品说明书查询
console.log('\n=== @38800~39050 药品说明书查询 ===');
show(38800, 39050);

// 4) 拍照识别 + 手动输入
console.log('\n=== @42700~43100 chat 拍照/手动 ===');
show(42700, 43100);

// 5) 添加药品整卡
console.log('\n=== @46000~47150 药箱添加卡 ===');
show(46000, 47150);

// 6) 舌象/脉象 select 前几行
console.log('\n=== @44960~45450 舌象/脉象 ===');
show(44960, 45450);

// 7) 报告按钮
console.log('\n=== @45600~45800 报告按钮 ===');
show(45600, 45800);
