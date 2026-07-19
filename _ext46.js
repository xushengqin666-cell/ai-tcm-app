const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
[[520715, 524564], [524575, 531783], [533772, 538876]].forEach(([a, b], i) => {
  const code = s.slice(a, b);
  console.log('=== 脚本' + (i+6) + ' (@' + a + ') 前300字 ===');
  console.log(code.slice(0, 300));
  // 是否调用主脚本函数
  const calls = ['doSearch','switchTab','sendChat','TCMEngine','renderApp','initApp','openManualInput'];
  const used = calls.filter(fn => code.includes(fn));
  console.log('调用主脚本函数:', used.length ? used.join(',') : '无');
  console.log('');
});
