const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 找到 T 对象
const tStart = s.indexOf('var T = {');
const tEnd = s.indexOf('};', tStart) + 2;
console.log('T 对象位置:', tStart, '-', tEnd, '长度:', tEnd - tStart);

// 提取 T 对象内容
let tBlock = s.slice(tStart, tEnd);
console.log('\nT 对象原始内容（最后500字符）:');
console.log(tBlock.slice(-500));

// 检查结构问题
const zhEnd = tBlock.indexOf('  ,', tBlock.indexOf('cabinetTab'));
console.log('\n\nzh 结束位置:', zhEnd);
console.log('zh 结束后内容:', tBlock.slice(zhEnd, zhEnd + 200));

// 问题：zh 和 en 之间没有正确分隔
// 需要找到 zh 的结束位置，然后插入 en: {

// 找 zh 的最后一个属性（在 en 开始之前）
const enStart = tBlock.indexOf("authTitle:'Caiyun");
console.log('\nen 开始位置:', enStart);
console.log('en 开始前20字符:', tBlock.slice(enStart - 20, enStart + 50));

// 修复策略：在 zh 结束后插入 } 和 en: {
// 但首先我们需要确认 zh 在哪里结束

// 找 "cabMemberNoAssign" 之后的位置
const cabMemberPos = tBlock.indexOf("cabMemberNoAssign");
console.log('\ncabMemberNoAssign 位置:', cabMemberPos);
if (cabMemberPos > 0) {
  console.log('周围内容:', tBlock.slice(cabMemberPos, cabMemberPos + 100));
}

process.exit(0);
