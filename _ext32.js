const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// sendChat 是否 async
const asyncSend = s.search(/async\s+function\s+sendChat/);
const plainSend = s.indexOf('function sendChat()');
console.log('async function sendChat:', asyncSend >= 0 ? ('@' + asyncSend) : 'NO');
console.log('function sendChat() @', plainSend, plainSend === asyncSend ? '(same)' : '(different or only one)');

// callGroqAPI 是否存在
const cg = s.indexOf('function callGroqAPI');
const cg2 = s.indexOf('callGroqAPI =');
console.log('callGroqAPI 定义:', (cg >= 0 || cg2 >= 0) ? '存在' : '不存在');

// callDashScope / callSiliconFlow / localFallback 是否存在（callAI 降级链）
['callDashScope','callSiliconFlow','localFallback'].forEach(fn => {
  const i = s.search(new RegExp('function\\s+' + fn + '\\b')) >= 0 || s.indexOf(fn + ' =') >= 0 || s.indexOf('var ' + fn) >= 0;
  console.log(fn + ':', i ? '存在' : '不存在');
});

// Worker 地址
const w = s.indexOf('workers.dev');
if (w >= 0) console.log('\nWorker 引用:', s.slice(w - 60, w + 40));
