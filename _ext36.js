const fs = require('fs');
const buf = fs.readFileSync('index.html');
const s = buf.toString('latin1');  // 保留原始字节，\r\n 可见

function show(anchor, len) {
  const i = s.indexOf(anchor);
  if (i < 0) { console.log('❌ 未找到:', anchor.slice(0,40)); return; }
  let seg = s.slice(i, i + len);
  // 把 \r\n 显示为 ⏎\n
  seg = seg.replace(/\r/g, '⏎');
  console.log('✅ @' + i + ':\n' + seg + '\n---');
}

show('// 2) 药库无果，症状匹配', 160);
show('// 调用 Groq API', 220);
show("const input = document.getElementById('chatInput');", 30);
