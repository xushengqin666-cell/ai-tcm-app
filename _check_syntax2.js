const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找 applyLang 函数
const funcStart = s.indexOf('function applyLang(lang){');
let depth = 0;
let inString = false;
let stringChar = '';
let funcEnd = funcStart;

for (let i = funcStart; i < s.length; i++) {
  const c = s[i];
  const prev = s[i-1];
  
  if (inString) {
    if (c === stringChar && prev !== '\\') inString = false;
  } else {
    if (c === '"' || c === "'" || c === '`') {
      inString = true;
      stringChar = c;
    } else if (c === '{') {
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && i > funcStart + 30) {
        funcEnd = i + 1;
        break;
      }
    }
  }
}

console.log('函数范围:', funcStart, '-', funcEnd, '长度:', funcEnd - funcStart);
const funcBody = s.slice(funcStart, funcEnd);
console.log('函数结尾50字符:', funcBody.slice(-50).replace(/\n/g, '↵'));

// 尝试编译
try {
  new Function(funcBody);
  console.log('✅ 语法OK');
} catch(e) {
  console.log('❌ 语法错误:', e.message);
}
