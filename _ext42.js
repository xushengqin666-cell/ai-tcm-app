const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找所有 id="reportGenerateBtn" 出现位置
let from = 0, n = 0;
const positions = [];
while ((from = s.indexOf('reportGenerateBtn', from)) >= 0 && n < 10) {
  positions.push(from);
  from += 19; n++;
}
console.log('reportGenerateBtn 出现位置:', positions);

// 判断第一处是否在 <script> 内（脚本引用）还是 <body> 静态 HTML
// 找 <body 和最后一个 <script> 在 body 之外的（head）
const bodyStart = s.indexOf('<body');
console.log('body @', bodyStart);

// 对每个位置，判断它前面最近的标签是 <script 还是普通 HTML 标签
positions.forEach((p, i) => {
  const before = s.slice(0, p);
  const lastScript = before.lastIndexOf('<script');
  const lastScriptClose = before.lastIndexOf('</script>');
  const inScript = lastScript > lastScriptClose;
  // 找前面最近的非 script 标签
  console.log((i+1) + ' @' + p + ' 在<script>内? ' + inScript);
});

// 特别看第一处（假定是静态 HTML 定义）
const first = positions[0];
console.log('\n第一处前后 300 字:');
console.log(s.slice(first - 200, first + 100).replace(/</g, '⏊'));
