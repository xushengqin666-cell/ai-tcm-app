const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找 authGate.classList / className 相关操作（在主脚本中）
const scriptStart = 58000; // 主脚本开始区域
const scriptArea = s.slice(scriptStart, Math.min(scriptStart + 80000, s.length));
const idx = scriptArea.indexOf('authGate.classList');
console.log('authGate.classList @' + (scriptStart + idx));

// 找所有 classList/className 改 authGate 的地方
let pos = 0;
const contexts2 = [];
while ((pos = scriptArea.indexOf('authGate', pos + 1)) > 0) {
  contexts2.push((scriptStart + pos) + ': ' + scriptArea.slice(Math.max(0, pos - 30), pos + 100).replace(/</g, '<').replace(/\n/g, '↵'));
}
console.log('\n主脚本中 authGate 引用 (' + contexts2.length + '个):');
contexts2.forEach(c => console.log(c));

// 找 cyAuthSkip / afterSplash / startApp 相关
const splash = s.indexOf('afterSplash');
console.log('\nafterSplash @' + splash + ':');
console.log(s.slice(splash, splash + 500).replace(/</g, '<').replace(/\n/g, '↵'));

process.exit(0);
