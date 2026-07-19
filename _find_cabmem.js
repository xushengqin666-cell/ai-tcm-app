const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
// 找所有 cabMember 引用
let i = -1;
const idxs = [];
while ((i = s.indexOf('cabMember', i+1)) >= 0) idxs.push(i);
console.log('cabMember 出现位置:', idxs);
// 找 openCabinet / fillCabinet / member 相关
['openCabinet','fillDrugNames','cabMembers','members','addMember','我'].forEach(k=>{
  let p = -1, all = [];
  while((p=s.indexOf(k,p+1))>=0 && all.length<5) all.push({i:p, ctx:s.slice(Math.max(0,p-50), Math.min(s.length,p+150))});
  if(all.length) {
    console.log('\n=== "'+k+'" ===');
    all.forEach(a=>console.log(' @'+a.i+': '+a.ctx.replace(/</g,'⏊').replace(/\n/g,' ')));
  }
});
// 找 设置 option 的地方（value="me" 或 "我" 作为 option 文本）
console.log('\n=== 查 我 在 cabMember 上下文 ===');
idxs.forEach(idx=>{
  if(idx<0)return;
  console.log('  @'+idx+': '+s.slice(Math.max(0,idx-30), Math.min(s.length,idx+200)).replace(/</g,'⏊').replace(/\n/g,' '));
});
