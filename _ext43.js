const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找真实 HTML 元素 <... id="reportGenerateBtn" ...>
const re = /<[^>]*\bid="reportGenerateBtn"[^>]*>/g;
let m, found = [];
while ((m = re.exec(s))) found.push(m[0]);
console.log('静态 HTML 中的 reportGenerateBtn 元素:', found.length ? found : '❌ 无（由 JS 动态注入）');

// 看 report 这个 tab 的大致结构（找 tab-report 容器）
const tr = s.indexOf('id="tab-report"');
console.log('\ntab-report 容器 @', tr);
if (tr >= 0) console.log(s.slice(tr, tr + 400).replace(/</g, '⏊'));
