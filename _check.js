const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const mO = s.indexOf('<script>', 40000);
const mC = s.indexOf('</script>', mO);
const tr = s.indexOf('id="tab-report"');
console.log('主脚本开@', mO, '闭@', mC);
console.log('tab-report@', tr);
console.log('主脚本是否在 tab-report 之后?', mO > tr);
console.log('文件字节:', Buffer.byteLength(s, 'utf8'));
