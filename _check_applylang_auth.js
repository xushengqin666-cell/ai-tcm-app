const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 检查 applyLang 中的 Modal 翻译行
const applyLangStart = s.indexOf('function applyLang');
const toggleLangIdx = s.indexOf('function toggleLang', applyLangStart);
const applyLangBody = s.slice(applyLangStart, toggleLangIdx);

// 找 Modal 翻译区域
const modalSection = s.slice(s.indexOf('// ===== Modal 元素翻译'), toggleLangIdx);
console.log('Modal section:');
console.log(modalSection);

// 找 authTitle 相关
const authLines = (modalSection.match(/authTitle|modalAuth/g) || []);
console.log('\nauthTitle/modalAuth in applyLang modal section:', authLines);
