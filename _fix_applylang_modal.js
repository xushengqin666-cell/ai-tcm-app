const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 修复 applyLang 中的 Modal authTitle 翻译
// 旧: getElementById('authTitle') + t.gateTitle (错误)
// 新: getElementById('modalAuthTitle') + t.authTitle (正确)
const old = "if(el=document.getElementById('authTitle')) el.textContent = t.gateTitle;";
const newS = "if(el=document.getElementById('modalAuthTitle')) el.textContent = t.authTitle;";

if (s.indexOf(old) >= 0) {
  s = s.replace(old, newS);
  console.log('✅ Modal authTitle 翻译已修复');
} else {
  console.log('⚠️ 未找到锚点');
}

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
