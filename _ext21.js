const s = require('fs').readFileSync('index.html', 'utf8');
function show(tok, len) {
  const i = s.indexOf(tok);
  if (i < 0) { console.log('NO ' + tok); return; }
  console.log('\n=== ' + tok + ' @' + i + ' ===');
  console.log(s.slice(i, i + (len || 1500)));
}
show('function searchBySymptom');
show('searchBySymptom(');
// 相互作用结果 div
let from = 0;
while ((from = s.indexOf('id="interact', from)) >= 0) {
  console.log('  ' + s.slice(from, from + 80));
  from += 12;
}
console.log('---');
// 查 TCMEngine
show('TCMEngine.');
show('comprehensiveAnalysis');
