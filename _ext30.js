const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

const ds = s.indexOf('function doSearch()');
const de = s.indexOf('function doSearch()', ds + 10);
// 找 doSearch 结束：下一个 function 或 switchTab
let end = s.indexOf('\nfunction ', ds + 20);
console.log('=== doSearch 完整 ===');
console.log(s.slice(ds, end).slice(0, 2600));

// chat 发送函数
const ci = s.indexOf('chatSendBtn');
let cstart = s.lastIndexOf('function', ci);
if (cstart < 0) cstart = s.lastIndexOf('addEventListener', ci) - 30;
// 找 chat 发送的事件绑定
const cs = s.indexOf("chatSendBtn.addEventListener");
console.log('\n=== chat 发送绑定 ===');
if (cs >= 0) {
  let d = 0, k = s.indexOf('{', cs);
  for (let e = k; e < s.length; e++) { if (s[e] === '{') { if (!d) { d = 1; k = e; } else d++; } else if (s[e] === '}') { d--; if (!d) { console.log(s.slice(cs, e + 1)); break; } } }
} else {
  console.log('未找到 chatSendBtn.addEventListener');
}
