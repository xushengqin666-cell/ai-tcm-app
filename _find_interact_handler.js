const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 找 interactBtn 的 onclick 或事件绑定
const btnIdx = s.indexOf('id="interactBtn"');
console.log('interactBtn onclick/handler:');
console.log(s.slice(btnIdx, btnIdx + 200));

// 找 showInteract 函数
const showIdx = s.indexOf('function showInteract(');
console.log('\nshowInteract:');
console.log(s.slice(showIdx, showIdx + 300));
