const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 找 afterSplash 唯一的锚点（在 else 块中）
const as = s.indexOf('function afterSplash(){');
const afterSplashBlock = s.slice(as, as + 500);
console.log('afterSplash 块:', afterSplashBlock.replace(/</g, '<').replace(/\n/g, '↵'));

// 找到 else { var g = document.getElementById('authGate'); if(g) g.classList.add('show'); }
const elseLine = "else { var g = document.getElementById('authGate'); if(g) g.classList.add('show'); }";
const old = elseLine;
const nw = "else { var g = document.getElementById('authGate'); if(g) { g.classList.add('show'); applyLang(currentLang); } }";
const cnt = s.split(old).length - 1;
console.log('出现次数:', cnt);

// 第一个出现在 cyAuthSkip，第二个在 afterSplash
// 找 afterSplash 后的那个
const afterSplashPos = s.indexOf('function afterSplash()');
const targetOld = s.indexOf(elseLine, afterSplashPos);
console.log('afterSplash 块内 @' + targetOld);

s = s.slice(0, targetOld) + s.slice(targetOld).replace(old, nw);
console.log('✅ applyLang 注入完成');

fs.writeFileSync('index.html', s, 'utf8');
console.log('🎉 写入完成，文件大小:', s.length);
process.exit(0);
