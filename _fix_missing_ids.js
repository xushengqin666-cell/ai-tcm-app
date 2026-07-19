const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 1. 给药品说明书查询标题加 ID
// 查找模式：<div class="section-title">📋 药品说明书查询</div>
const manualTitlePattern = '<div class="section-title">📋 药品说明书查询</div>';
const manualTitleReplace = '<div class="section-title" id="manualTitle">📋 药品说明书查询</div>';
if (s.indexOf(manualTitlePattern) >= 0) {
  s = s.replace(manualTitlePattern, manualTitleReplace);
  console.log('✅ manualTitle ID 已添加');
} else {
  console.log('⚠️ manualTitle 模式未找到');
}

// 2. cameraBtn 实际上是 cameraBtnLabel，需要给父按钮加 ID 或改 applyLang 逻辑
// 查找并给拍照识别按钮加 ID
const cameraBtnPattern = '<span id="cameraBtnLabel">拍照识别</span>';
const cameraBtnReplace = '<span id="cameraBtn">拍照识别</span>';
if (s.indexOf(cameraBtnPattern) >= 0) {
  s = s.replace(cameraBtnPattern, cameraBtnReplace);
  console.log('✅ cameraBtn ID 已修改');
} else {
  console.log('⚠️ cameraBtn 模式未找到');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
