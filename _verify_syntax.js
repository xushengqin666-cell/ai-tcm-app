const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 提取所有 script 块并检查语法
let pos = 0;
let errors = [];

while (true) {
  const open = s.indexOf('<script>', pos);
  if (open < 0) break;
  const close = s.indexOf('</script>', open);
  if (close < 0) break;
  
  const inner = s.slice(open + 8, close).trim();
  if (inner && !inner.startsWith('<!--')) {
    try {
      new Function(inner);
    } catch(e) {
      errors.push({ pos: open, msg: e.message.slice(0, 100) });
    }
  }
  pos = close + 9;
}

if (errors.length === 0) {
  console.log('✅ 所有 script 块语法检查通过');
} else {
  console.log('❌ 发现', errors.length, '个语法错误:');
  errors.forEach(e => console.log('  @' + e.pos + ':', e.msg));
}

// 检查 T 对象
const tStart = s.indexOf('var T = {');
const tEnd = s.indexOf('};', tStart) + 2;
const tBlock = s.slice(tStart, tEnd);
try {
  new Function('return ' + tBlock)();
  console.log('✅ T 对象语法检查通过');
} catch(e) {
  console.log('❌ T 对象语法错误:', e.message);
}
