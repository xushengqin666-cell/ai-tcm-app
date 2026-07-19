const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 找 applyLang 函数结尾（在第一个 } 后加 window 暴露）
const afS = s.indexOf('function applyLang(lang){');
const afB = s.indexOf('{', afS);
let dd = 0, afEnd = afB;
for (let i = afB; i < s.length; i++) {
  if (s[i] === '{') dd++;
  else if (s[i] === '}') { dd--; if (!dd) { afEnd = i + 1; break; } }
}
console.log('applyLang 范围: @' + afS + ' ~ @' + afEnd);
console.log('applyLang 末尾:', s.slice(Math.max(0, afEnd - 80), afEnd + 10).replace(/</g, '<').replace(/\n/g, '↵'));

// 检查是否已有 window.applyLang
const hasWindowApply = s.indexOf('window.applyLang = applyLang');
console.log('window.applyLang 已有:', hasWindowApply >= 0 ? '✅' : '❌');

// 在 applyLang 函数定义后加 window 暴露
if (hasWindowApply < 0) {
  // 找第一个分号或换行在 applyLang 结尾
  const insPos = afEnd;
  const insStr = '\r\nwindow.applyLang = applyLang; window.currentLang = currentLang;';
  s = s.slice(0, insPos) + insStr + s.slice(insPos);
  console.log('✅ window 暴露已注入');
} else {
  console.log('✅ window 暴露已存在');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('🎉 写入完成，文件大小:', s.length);
process.exit(0);
