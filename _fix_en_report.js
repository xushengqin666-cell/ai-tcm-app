const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 修复 T.en 中的 reportSymptomLabel 和 reportSymptomPlaceholder
const wrongEn = "reportSymptomLabel:'症状（用逗号/空格分隔，如：口干、心烦、失眠）',reportSymptomPlaceholder:'口干, 心烦, 失眠'";
const correctEn = "reportSymptomLabel:'Symptoms (comma/space separated, e.g.: dry mouth, insomnia)',reportSymptomPlaceholder:'dry mouth, insomnia, anxiety'";

if (s.indexOf(wrongEn) >= 0) {
  s = s.replace(wrongEn, correctEn);
  console.log('✅ T.en reportSymptomLabel/Placeholder 已修复为英文');
} else {
  console.log('⚠️ 未找到错误的 T.en 模式');
  // 检查是否已经是正确的
  if (s.indexOf(correctEn) >= 0) {
    console.log('✓ 已经是正确的英文');
  }
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
