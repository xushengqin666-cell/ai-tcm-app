const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 1. 给 label 添加 id
const oldLabel = '<label style="display:block;margin-bottom:4px">症状（用逗号/空格分隔，如：口干、心烦、失眠）</label>';
const newLabel = '<label style="display:block;margin-bottom:4px" id="reportSymptomLabel">症状（用逗号/空格分隔，如：口干、心烦、失眠）</label>';
if (s.indexOf(oldLabel) >= 0) {
  s = s.replace(oldLabel, newLabel);
  console.log('✅ reportSymptomLabel ID 已添加');
} else {
  console.log('⚠️ label 模式未找到');
}

// 2. 给 input 添加正确的 id（从 reportSymptoms 改为 reportSymptomInput）
const oldInput = 'id="reportSymptoms" placeholder="口干, 心烦, 失眠"';
const newInput = 'id="reportSymptomInput" placeholder="口干, 心烦, 失眠"';
if (s.indexOf(oldInput) >= 0) {
  s = s.replace(oldInput, newInput);
  console.log('✅ reportSymptomInput ID 已修正');
} else {
  console.log('⚠️ input 模式未找到');
}

// 3. 在 T.zh 中添加 reportSymptomPlaceholder
const zhInsertPattern = "reportSymptomLabel:'症状（用逗号/空格分隔，如：口干、心烦、失眠）',";
const zhNewPattern = "reportSymptomLabel:'症状（用逗号/空格分隔，如：口干、心烦、失眠）',reportSymptomPlaceholder:'口干, 心烦, 失眠',";
if (s.indexOf(zhInsertPattern) >= 0 && s.indexOf('reportSymptomPlaceholder') < 0) {
  s = s.replace(zhInsertPattern, zhNewPattern);
  console.log('✅ T.zh reportSymptomPlaceholder 已添加');
} else {
  console.log('⚠️ T.zh 插入点未找到或已存在');
}

// 4. 在 T.en 中添加对应键
const enInsertPattern = "reportSymptomLabel:'Symptoms (comma/space separated, e.g.: dry mouth, insomnia)',";
const enNewPattern = "reportSymptomLabel:'Symptoms (comma/space separated, e.g.: dry mouth, insomnia)',reportSymptomPlaceholder:'dry mouth, insomnia, anxiety',";
if (s.indexOf(enInsertPattern) >= 0 && s.indexOf("reportSymptomPlaceholder:'dry") < 0) {
  s = s.replace(enInsertPattern, enNewPattern);
  console.log('✅ T.en reportSymptomPlaceholder 已添加');
} else {
  console.log('⚠️ T.en 插入点未找到或已存在');
}

// 5. 在 applyLang 中添加处理
const oldApplyLang = "if(el=document.getElementById('reportSymptomLabel')) el.textContent = t.reportSymptomLabel;";
const newApplyLang = "if(el=document.getElementById('reportSymptomLabel')) el.textContent = t.reportSymptomLabel;if(el=document.getElementById('reportSymptomInput')) el.placeholder = t.reportSymptomPlaceholder || 'dry mouth, insomnia';";
if (s.indexOf(oldApplyLang) >= 0) {
  s = s.replace(oldApplyLang, newApplyLang);
  console.log('✅ applyLang 已扩展');
} else {
  console.log('⚠️ applyLang 插入点未找到');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
