const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

function show(anchor, len) {
  const i = s.indexOf(anchor);
  if (i < 0) { console.log('❌ 未找到:', anchor.slice(0,30)); return; }
  let seg = s.slice(i, i + len).replace(/\r/g, '⏎');
  console.log('✅ @' + i + ':\n' + seg + '\n---');
}
show('// 2) 药库无果，症状匹配', 170);
show('// 调用 Groq API', 240);
