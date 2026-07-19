const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// symptomInput 附近的监听绑定
const si = s.indexOf('id="symptomInput"');
console.log('=== symptomInput 附近 400 字 ===');
console.log(s.slice(si - 60, si + 400).replace(/</g, '⏊'));

// 找 symptomInput 的 addEventListener
const after = s.slice(si, si + 2000);
const lis = after.match(/addEventListener\(['"](\w+)['"]/g);
console.log('\n=== symptomInput 后 2000 字内的监听 ===');
console.log(lis ? lis.join(', ') : '无直接监听');

// 相互作用：找 interactBtn 前的输入框
const ib = s.indexOf('id="interactBtn"');
console.log('\n=== interactBtn 前 800 字 ===');
console.log(s.slice(ib - 800, ib).replace(/</g, '⏊'));
