const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 提取主脚本
const inner = s.slice(49112 + 8, 49112 + 8 + 480004);
// 用 Node.js 语法检查
try {
  // Node.js 的 vm.compileFunction 会做语法检查但不执行
  require('vm').compileFunction(inner, []);
  console.log('✅ 语法 OK');
} catch(e) {
  console.log('❌ 语法错误:', e.message);
  // 找错误位置
  const m = e.message.match(/at position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('错误位置 @' + pos + ':', inner.slice(Math.max(0, pos - 100), pos + 200).replace(/\r?\n/g, '↵'));
  }
}
