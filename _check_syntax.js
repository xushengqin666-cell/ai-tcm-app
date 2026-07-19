const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找主脚本块
const scripts = [];
let pos = 0;
let si = 0;
while (true) {
  const open = s.indexOf('<script>', pos);
  if (open < 0) break;
  const close = s.indexOf('</script>', open);
  if (close < 0) break;
  const inner = s.slice(open + 8, close);
  scripts.push({ i: si++, open, close, len: close - open, preview: inner.slice(0, 100).replace(/\n/g,'↵') });
  pos = close + 9;
}
scripts.forEach((s, i) => console.log(`脚本${i} @${s.open} len=${s.len} 预览: ${s.preview}`));

// 对每个脚本做语法检查
console.log('\n语法检查:');
scripts.forEach((s, i) => {
  try {
    new Function(scripts[i].preview + '\n})}'); // fake closure
  } catch(e) {
    // 上面的方法不对，用 vm
  }
  try {
    require('vm').compileFunction(scripts[i].preview, []);
    console.log(`  脚本${i}: OK`);
  } catch(e) {
    console.log(`  脚本${i}: ❌ ${e.message.slice(0, 120)}`);
  }
});
process.exit(0);
