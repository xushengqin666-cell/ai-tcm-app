const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// matchDrugsFromOCRText 是否定义
const def = s.indexOf('function matchDrugsFromOCRText');
console.log('matchDrugsFromOCRText 定义:', def >= 0 ? ('@' + def) : '❌ 未定义(流程里调了但不存在!)');

// runDrugOCR 原始字节范围
const start = s.indexOf('function runDrugOCR');
// 找结束 }
let d = 0, k = s.indexOf('{', start);
let end = -1;
for (let e = k; e < s.length; e++) {
  if (s[e] === '{') { if (!d) { d = 1; } else d++; }
  else if (s[e] === '}') { d--; if (!d) { end = e; break; } }
}
console.log('runDrugOCR 范围: @' + start + ' ~ @' + end + ' (长度 ' + (end - start + 1) + ')');

// drugManualInput 附近原始字节（看引号转义）
const dm = s.indexOf('drugManualInput');
const seg = s.slice(dm - 30, dm + 120);
let out = '';
for (let i = 0; i < seg.length; i++) {
  const c = seg[i];
  if (c === "'") out += "‖'‖";   // 标记单引号
  else if (c === '"') out += '‹"›';
  else if (c === '\\') out += '⧵';
  else out += c;
}
console.log('\ndrugManualInput 附近(单引号=‖\'‖ 双引号=‹"› 反斜杠=⧵):');
console.log(out);
