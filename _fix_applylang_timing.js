const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 找 authGate 渲染位置（startApp → showAuthGate）
const sa = s.indexOf('function startApp');
const sg = s.indexOf('showAuthGate', sa);
console.log('startApp @' + sa + ', showAuthGate @' + sg);
if (sg < 0) { console.log('❌ showAuthGate 未找到'); process.exit(1); }

// 提取 showAuthGate 上下文
console.log('\nshowAuthGate 上下文 @' + sg + ':');
console.log(s.slice(sg, sg + 500).replace(/</g, '<').replace(/\n/g, '↵'));

// 找 showAuthGate 函数定义
const sagDef = s.lastIndexOf('function showAuthGate', sg);
console.log('\nshowAuthGate 函数定义 @' + sagDef + ':');
console.log(s.slice(sagDef, sagDef + 600).replace(/</g, '<').replace(/\n/g, '↵'));

// 找 authGate 插入/innerHTML 相关代码
const ag = s.indexOf('authGate');
const agContexts = [];
for (let i = 0; i < 5; i++) {
  const pos = s.indexOf('authGate', agContexts.length > 0 ? agContexts[agContexts.length - 1].pos + 1 : 0);
  if (pos < 0 || pos > sagDef + 2000) break;
  agContexts.push({ pos, ctx: s.slice(Math.max(0, pos - 30), pos + 80).replace(/</g, '<') });
}
console.log('\nauthGate 出现位置:', agContexts.map(a => '@' + a.pos + ': ' + a.ctx));

process.exit(0);
