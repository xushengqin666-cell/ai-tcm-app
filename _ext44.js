const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const handlerPos = s.indexOf('// 辨证报告生成');
console.log('handler 脚本位置:', handlerPos);
console.log('tab-report HTML 位置:', 516032);
console.log('reportGenerateBtn HTML 位置:', 517478);
console.log('handler 在 tab-report 之前?', handlerPos < 516032);
console.log('handler 在 reportGenerateBtn 之前?', handlerPos < 517478);

// 找 handler 所在 script 块的 <script 起点和 </script> 终点
const scriptStart = s.lastIndexOf('<script', handlerPos);
const scriptEnd = s.indexOf('</script>', handlerPos);
console.log('\nhandler 所在 <script> @', scriptStart, ' </script> @', scriptEnd);
console.log('该 script 块是否在 tab-report(516032) 之前?', scriptStart < 516032);

// 该 script 是否含 DOMContentLoaded 包裹？
console.log('该块含 DOMContentLoaded?', s.slice(scriptStart, scriptEnd).includes('DOMContentLoaded'));
