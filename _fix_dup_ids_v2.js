const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
const before = s.length;

// 修复重复 ID
s = s.replace(/id="profileSettingsBtn" id="profileSettingsBtn"/g, 'id="profileSettingsBtn"');
s = s.replace(/id="profileAboutBtn" id="profileAboutBtn"/g, 'id="profileAboutBtn"');
s = s.replace(/id="profileEditBtn" id="profileEditBtn"/g, 'id="profileEditBtn"');
s = s.replace(/id="profileLogoutBtn" id="profileLogoutBtn"/g, 'id="profileLogoutBtn"');

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');

console.log('size:', s.length, '(diff:', s.length - before, ')');
console.log('settings count:', (s.match(/id="profileSettingsBtn"/g) || []).length);
console.log('about count:', (s.match(/id="profileAboutBtn"/g) || []).length);
console.log('edit count:', (s.match(/id="profileEditBtn"/g) || []).length);
console.log('logout count:', (s.match(/id="profileLogoutBtn"/g) || []).length);

// 验证 applyLang 中 profile 按钮翻译
const applyLangStart = s.indexOf('function applyLang');
const applyLangEnd = s.indexOf('function toggleLang', applyLangStart);
const applyLangBody = s.slice(applyLangStart, applyLangEnd);
console.log('\napplyLang 中 profileEditBtn 引用:', (applyLangBody.match(/profileEditBtn/g) || []).length);
console.log('applyLang 中 profileSettingsBtn 引用:', (applyLangBody.match(/profileSettingsBtn/g) || []).length);
console.log('applyLang 中 profileAboutBtn 引用:', (applyLangBody.match(/profileAboutBtn/g) || []).length);
console.log('applyLang 中 profileLogoutBtn 引用:', (applyLangBody.match(/profileLogoutBtn/g) || []).length);
console.log('applyLang 中 profileEditTitle 引用:', (applyLangBody.match(/profileEditTitle/g) || []).length);
console.log('applyLang 中 authTitle 引用:', (applyLangBody.match(/authTitle/g) || []).length);
