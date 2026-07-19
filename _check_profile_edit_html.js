const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 在 body 里找 tab-profile 区块
const bodyIdx = s.indexOf('<body');
// T 对象大约在 5000-25000 范围 (在 <script> 里)
// 找在 T 对象之后 (body 里) 的 profileEditTitle
const tEnd = s.indexOf('function drugLabel');
const afterT = s.slice(tEnd);
const profileEditTitleIdx = afterT.indexOf('profileEditTitle');
console.log('profileEditTitle 在 T 对象之后 @', tEnd + profileEditTitleIdx);
console.log(afterT.slice(profileEditTitleIdx - 50, profileEditTitleIdx + 500));

// 找 authModal
const authModalIdx = afterT.indexOf('authModal');
console.log('\nauthModal @', tEnd + authModalIdx);
console.log(afterT.slice(authModalIdx, authModalIdx + 200));
