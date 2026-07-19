const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找所有 TCMEngine. 调用
let from = 0, count = 0;
while ((from = s.indexOf('TCMEngine.', from)) >= 0 && count < 30) {
  const line = s.slice(s.lastIndexOf('\n', from) + 1, s.indexOf('\n', from)).trim();
  console.log((count + 1) + '. ' + line.slice(0, 120));
  from += 10; count++;
}

console.log('\n=== 报告生成完整代码 ===');
const ri = s.indexOf('reportGenerateBtn');
let depth = 0, i = s.indexOf('addEventListener', ri > 0 ? ri : s.indexOf('reportGenerate'));
// 直接找绑定
const bindIdx = s.indexOf("getElementById('reportGenerateBtn')");
if (bindIdx < 0) var bindIdx2 = s.indexOf('reportGenerateBtn').bindIdx = bindIdx;
let start = s.indexOf('reportGenerateBtn');
while (start > 0 && s[start] !== '.') start--;
// 找到 .addEventListener 或 .onclick
let j = s.indexOf('addEventListener', start);
if (j < 0) j = s.indexOf('click', start);
if (j >= 0) {
  let d = 0, k = j;
  for (; k < s.length; k++) { if (s[k] === '{') { d++; break; } }
  let end = k, depth2 = 1;
  for (k++; k < s.length; k++) { if (s[k] === '{') depth2++; else if (s[k] === '}') { depth2--; if (!depth2) { end = k + 1; break; } } }
  console.log(s.slice(j, end));
}
