const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
// 抽取 runTesseract 确认用的是 dataUrl
const i = s.indexOf('function runTesseract');
const j = s.indexOf('function runDrugOCR', i);
const k = s.indexOf('preprocessImage', j);
console.log('=== runTesseract (前 600 字) ===');
console.log(s.slice(i, i + 600).replace(/</g,'⏊'));
// runDrugOCR 确认走 callCloudOCR
console.log('\n=== runDrugOCR (全文) ===');
const e = s.indexOf('function preprocessImage');
console.log(s.slice(j, e).replace(/</g,'⏊'));
// 大括号平衡检查（新函数群）
const grp = s.slice(i, e);
let bal = 0; for (const c of grp){ if(c==='{')bal++; else if(c==='}')bal--; }
console.log('\n新函数群括号平衡:', bal === 0 ? 'OK' : ('不平衡='+bal));
