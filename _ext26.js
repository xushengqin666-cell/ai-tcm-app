const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找 searchBtn 的 onclick 或 addEventListener
let from = 0, n = 0;
while ((from = s.indexOf('searchBtn', from)) >= 0 && n < 20) {
  const line = s.slice(s.lastIndexOf('\n', from) + 1, s.indexOf('\n', from)).trim();
  if (line.includes('click') || line.includes('addEventListener') || line.includes('getElementById') || line.includes('onclick')) {
    console.log((n + 1) + '. ' + line.slice(0, 140));
    n++;
  }
  from += 8;
}
console.log('\n=== searchInput 全局变量定义 ===');
const si = s.indexOf("var searchInput");
if (si >= 0) console.log(s.slice(si, si + 120));
else console.log('未找到 var searchInput');

// 找 doSearch 调用点
console.log('\n=== doSearch 调用点 ===');
from = 0; n = 0;
while ((from = s.indexOf('doSearch', from)) >= 0 && n < 10) {
  const line = s.slice(s.lastIndexOf('\n', from) + 1, s.indexOf('\n', from)).trim();
  console.log((n + 1) + '. ' + line.slice(0, 120));
  from += 8; n++;
}
