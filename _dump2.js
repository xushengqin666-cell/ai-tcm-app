const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
// 登录表单
const loginSection = s.slice(540200, 540800).replace(/</g, '<');
console.log('=== 登录表单 ===');
console.log(loginSection);
// 找注册按钮
const regBtn = s.indexOf('切换到注册');
console.log('\n=== 注册链接 @' + regBtn + ' ===');
if(regBtn>0) console.log(s.slice(Math.max(0,regBtn-30), regBtn+100).replace(/</g,'<').replace(/\n/g,' '));
// 找品牌语
const tagline = s.indexOf('家庭 AI 药师');
console.log('\n=== 品牌语 @' + tagline + ' ===');
if(tagline>0) console.log(s.slice(Math.max(0,tagline-100), tagline+200).replace(/</g,'<').replace(/\n/g,' '));
// 找 authMode 切换（登录/注册切换 JS）
const authMode = s.indexOf('authMode');
console.log('\n=== authMode @' + authMode + ' ===');
if(authMode>0) console.log(s.slice(Math.max(0,authMode-30), authMode+300).replace(/</g,'<').replace(/\n/g,' '));
// 找 cyAuthToggle
const authToggle = s.indexOf('cyAuthToggle');
console.log('\n=== cyAuthToggle @' + authToggle + ' ===');
if(authToggle>0) console.log(s.slice(Math.max(0,authToggle-20), authToggle+200).replace(/</g,'<').replace(/\n/g,' '));
process.exit(0);
