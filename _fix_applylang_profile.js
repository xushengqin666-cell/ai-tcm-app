const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 在 applyLang 中添加 navProfile
const oldApply = "if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;\n}\r\nwindow.applyLang = applyLang;";
const newApply = "if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;\nif(el=document.getElementById('navProfile')) el.textContent = t.navProfile;\n}\r\nwindow.applyLang = applyLang;";

if (s.indexOf(oldApply) >= 0) {
  s = s.replace(oldApply, newApply);
  console.log('✅ applyLang navProfile 已添加');
} else {
  console.log('⚠️ 模式未找到');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
