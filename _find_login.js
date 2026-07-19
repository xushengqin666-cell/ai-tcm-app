const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
// 找登录弹窗锚点
const keywords = ['登录','注册','手机号','密码（','跳过'];
keywords.forEach(k=>{
  const p = s.indexOf(k);
  if(p>=0) console.log('"'+k+'": @'+p, s.slice(Math.max(0,p-60),p+k.length+30).replace(/</g,'⏊').replace(/\n/g,' '));
});
