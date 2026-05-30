const fs=require('fs');
let kb=JSON.parse(fs.readFileSync('kb.json','utf8'));
let other=kb.filter(e=>e.cat==='其他');
console.log('当前"其他"分类条目数:',other.length);
console.log('\n现有条目:');
other.forEach((e,i)=>console.log(`${i+1}. ${e.t}`));
