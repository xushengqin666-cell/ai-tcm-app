const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 检查 authTabLogin 附近的 HTML
const at = s.indexOf('id="authTabLogin"');
console.log('authTabLogin @' + at + ':', s.slice(Math.max(0, at - 50), at + 120).replace(/</g, '<').replace(/\n/g, '↵'));

// 检查 authSubmitBtn 附近
const as = s.indexOf('id="authSubmitBtn"');
console.log('\nauthSubmitBtn @' + as + ':', s.slice(Math.max(0, as - 80), as + 100).replace(/</g, '<').replace(/\n/g, '↵'));

// 检查 applyLang 中 authTabLogin 的代码
const fnStart = s.indexOf('function applyLang');
const fnEnd = fnStart + 10000;
const fn = s.slice(fnStart, fnEnd);
const authTabLoginCode = fn.indexOf("'authTabLogin'");
console.log('\napplyLang 中 authTabLogin:', authTabLoginCode >= 0 ? fn.slice(authTabLoginCode - 20, authTabLoginCode + 120) : '❌ 不存在');

// 检查 applyLang 中 authPhonePh
const authPhonePhCode = fn.indexOf("'authPhonePh'");
console.log('\napplyLang 中 authPhonePh:', authPhonePhCode >= 0 ? fn.slice(authPhonePhCode - 20, authPhonePhCode + 120) : '❌ 不存在');

// 检查 applyLang 中 authSubmitBtn
const authSubmitBtnCode = fn.indexOf("'authSubmitBtn'");
console.log('\napplyLang 中 authSubmitBtn:', authSubmitBtnCode >= 0 ? fn.slice(authSubmitBtnCode - 20, authSubmitBtnCode + 120) : '❌ 不存在');

// 检查 T.en.authTabLogin
const ten = s.indexOf('T.en = {') >= 0 ? s.slice(s.indexOf('en:', s.indexOf('zh:') + 1)) : '';
const tenEnd = ten.indexOf('}', 100);
console.log('\nT.en 含 authTabLogin?', ten.includes('authTabLogin:'));
console.log('T.en 含 authPhonePh?', ten.includes('authPhonePh:'));
console.log('T.en 含 authSubmitBtn?', ten.includes('authSubmitBtn:'));

process.exit(0);
