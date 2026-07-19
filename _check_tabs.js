const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 检查所有 [data-tab] 元素
const dataTabs = s.match(/data-tab="[^"]+"/g);
console.log('所有 data-tab:', [...new Set(dataTabs)]);

// 检查底部导航
const bottomNav = s.match(/<nav[^>]*class="[^"]*bottom[^"]*"[^>]*>[\s\S]{0,500}/);
console.log('底部导航:', bottomNav ? bottomNav[0].slice(0, 500) : 'NOT FOUND');
