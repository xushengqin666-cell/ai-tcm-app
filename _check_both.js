const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
// 检查 T.zh 中的 profileAbout
const zhAbout = s.match(/profileAbout:'([^']+)'/g);
console.log('所有 profileAbout:', zhAbout);
// 检查 T.en 中的 profileAbout
const enAbout = s.match(/profileAbout:'([^']+)'/g);
console.log('T.en profileAbout:', enAbout);
// 检查 profileAbout 在 T.zh 中的位置
const p = s.indexOf("profileAbout:'");
console.log('前后 100 字:', s.slice(p - 20, p + 100));
