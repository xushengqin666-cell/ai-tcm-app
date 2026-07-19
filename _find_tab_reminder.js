const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

const start = s.indexOf('<div id="tab-reminder"');
if (start < 0) {
  console.log('tab-reminder not found');
  process.exit(1);
}

// 找到匹配的闭合 </div>
let depth = 0;
let inString = false;
let stringChar = '';
let i = start;

while (i < s.length) {
  const c = s[i];
  const next = s[i+1];
  
  if (!inString) {
    if (c === '<' && next === 'd' && s.slice(i,i+4) === '<div') {
      depth++;
      i += 4;
      continue;
    }
    if (c === '<' && next === '/' && s.slice(i,i+6) === '</div>') {
      depth--;
      if (depth === 0) {
        console.log('tab-reminder 结束位置:', i + 6);
        console.log('上下文:', s.slice(i-50, i+100).replace(/</g, '<'));
        break;
      }
      i += 6;
      continue;
    }
    if (c === '"' || c === "'") {
      inString = true;
      stringChar = c;
    }
  } else {
    if (c === stringChar && s[i-1] !== '\\') {
      inString = false;
    }
  }
  i++;
}
