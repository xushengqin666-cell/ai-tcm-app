const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 查看 profile edit modal 的完整 HTML (从 profileEditTitle 位置)
const tEnd = s.indexOf('function drugLabel');
const afterT = s.slice(tEnd);
const profileEditTitleIdx = afterT.indexOf('profileEditTitle');
console.log('=== Profile Edit Modal 完整 HTML ===');
console.log(afterT.slice(profileEditTitleIdx - 20, profileEditTitleIdx + 2000));

// 找 closeProfileModal 函数
const closeProfileIdx = s.indexOf('function closeProfileModal');
console.log('\n=== closeProfileModal ===');
console.log(s.slice(closeProfileIdx, closeProfileIdx + 300));

// 找 closeAuthModal 函数
const closeAuthIdx = s.indexOf('function closeAuthModal');
console.log('\n=== closeAuthModal ===');
console.log(s.slice(closeAuthIdx, closeAuthIdx + 200));

// 找 openAuthModal 函数
const openAuthIdx = s.indexOf('function openAuthModal');
console.log('\n=== openAuthModal ===');
console.log(s.slice(openAuthIdx, openAuthIdx + 300));
