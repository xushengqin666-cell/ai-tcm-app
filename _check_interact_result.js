const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 找 interactResult 的实际 ID
const r = s.match(/interactResult|interactDetail|checkInteract|getInteractionResult/g);
console.log('交互相关代码:', [...new Set(r)]);

// 找 checkInteraction 函数
const p = s.indexOf('function checkInteraction');
console.log('checkInteraction @:', p, ':', s.slice(p, p + 100));

// 找 unionResultSummary
const up = s.indexOf('unionResultSummary');
console.log('unionResultSummary @:', up, ':', s.slice(up, up + 100));
