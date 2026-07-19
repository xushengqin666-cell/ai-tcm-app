const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 找与 interactBtn 相关的函数
const interactBtnIdx = s.indexOf('id="interactBtn"');
console.log('interactBtn @:', interactBtnIdx);
console.log('附近 300 字:', s.slice(interactBtnIdx, interactBtnIdx + 300));

// 找所有包含 "interact" 的函数
const fns = s.match(/function \w+Inter\w+\(|function \w+[Ii]nteract\w*\(/g);
console.log('交互相关函数:', fns);
