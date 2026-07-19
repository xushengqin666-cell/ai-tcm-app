const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// doSearch 第2段（症状匹配）起
const p2 = s.indexOf('var symResults = [];');
console.log('=== doSearch 第2段 ===');
console.log(s.slice(p2, p2 + 1200));

// matchDrugsBySymptom 实现
const mds = s.indexOf('function matchDrugsBySymptom');
console.log('\n=== matchDrugsBySymptom ===');
if (mds >= 0) console.log(s.slice(mds, mds + 900));
else console.log('未找到独立函数定义');
