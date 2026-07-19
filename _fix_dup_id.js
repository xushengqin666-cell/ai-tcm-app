const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 1. 修复 profileEditBtn 重复 ID
const dupBtn = 'id="profileEditBtn" id="profileEditBtn"';
const fixedBtn = 'id="profileEditBtn"';
if (s.indexOf(dupBtn) >= 0) {
  s = s.replace(dupBtn, fixedBtn);
  console.log('✅ 重复 ID 已修复');
} else {
  console.log('⚠️ 重复 ID 未找到');
}

// 2. 检查实际交互元素 ID
const interactSection = s.match(/<input[^>]*id="[^"]*[Dd]rug[^"]*"[^>]*>/g);
console.log('交互 Drug 输入框:', interactSection);

// 3. 检查 interactResult 的实际 ID
const resultMatch = s.match(/id="[^"]*[Rr]esult[^"]*"/g);
console.log('Result IDs:', resultMatch);

// 4. 检查症状相关元素
const symptomIds = s.match(/id="[^"]*[Ss]ymptom[^"]*"/g);
console.log('Symptom IDs:', symptomIds);

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
