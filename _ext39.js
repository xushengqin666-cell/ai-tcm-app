const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const i = s.indexOf('// 2) 药库无果');
console.log('注释位置:', i);
const seg = s.slice(i, i + 200);
// 逐字符显示行尾
let out = '';
for (let k = 0; k < seg.length; k++) {
  const c = seg[k];
  if (c === '\r') out += '⏎';
  else if (c === '\n') out += '⏎\n';
  else out += c;
}
console.log('=== 真实片段 ===');
console.log(out);
console.log('=== 我的 old2 期望 ===');
const expect = "// 2) 药库无果，症状匹配\r\n  var symResults = [];\r\n  try { symResults = (typeof matchDrugsBySymptom === 'function') ? matchDrugsBySymptom(q) : []; } catch(ex) { symResults = []; }";
console.log(expect);
console.log('\n匹配测试:', s.indexOf(expect) >= 0 ? 'YES' : 'NO');
