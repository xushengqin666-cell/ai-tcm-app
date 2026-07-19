const fs = require('fs');
const buf = fs.readFileSync('index.html');
const s = buf.toString('utf8');
const i = s.indexOf('药库无果，症状匹配');
// 打印前 120 字节的 hex 看行尾
const slice = buf.slice(i - 20, i + 140);
let hex = '';
for (let k = 0; k < slice.length; k++) {
  hex += slice[k].toString(16).padStart(2, '0') + ' ';
  if ((k + 1) % 20 === 0) hex += '\n';
}
console.log(hex);
console.log('\n可读:', slice.toString('utf8'));
// 检测 \r\n vs \n
console.log('\n含 \\r\\n:', s.includes('\r\n'), ' 含 \\n:', s.includes('\n'), ' 含 \\r:', s.includes('\r'));
