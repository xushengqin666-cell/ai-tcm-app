const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// authTitle 键缺失 - 当前 T.zh/en 里是 modalAuthTitle
// applyLang 用 t.authTitle, 所以加 authTitle 键
// 方案: 在 modalAuthTitle 后加 authTitle
s = s.replace(
  /modalAuthTitle:'🔐 登录',/g,
  "modalAuthTitle:'🔐 登录',authTitle:'🔐 登录',"
);
s = s.replace(
  /modalAuthTitle:'🔐 Login',/g,
  "modalAuthTitle:'🔐 Login',authTitle:'🔐 Login',"
);

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('✅ authTitle 键已添加');
console.log('文件大小:', s.length);
