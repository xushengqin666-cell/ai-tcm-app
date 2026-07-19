const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找 T 函数定义 + 翻译对象
console.log('=== i18n 核心 ===');
['function T(', 'var T =', 'const T =', 'window.T'].forEach(p => {
  const i = s.indexOf(p);
  if (i >= 0) console.log('  ' + p + ' @' + i);
});

// 翻译表（找一个较大的 i18n 对象）
console.log('\n=== 翻译表对象 ===');
['i18n', 'translations', 'T = {', 'lang = {', 'STRINGS'].forEach(p => {
  const i = s.indexOf(p);
  if (i >= 0) console.log('  ' + p + ' @' + i);
});

// applyLang / switchLang / setLang
console.log('\n=== 语言切换函数 ===');
['function applyLang', 'function switchLang', 'function setLang', 'applyLang()', '切换语言', 'i18n:', 'lang:'].forEach(p => {
  let from = 0, hits = [];
  while ((from = s.indexOf(p, from)) >= 0 && hits.length < 3) { hits.push(from); from += p.length; }
  if (hits.length) console.log('  ' + p + ' -> ' + hits.map(h => '@' + h).join(', '));
});

// 当前语言状态
console.log('\n=== localStorage 语言键 ===');
const lsKeys = ['cy_lang', 'lang', 'i18n_lang'];
lsKeys.forEach(k => { const i = s.indexOf("'" + k + "'"); if (i >= 0) console.log('  ' + k + ' @' + i); });

// 截取 applyLang 函数（如有）
const ai = s.indexOf('function applyLang');
if (ai >= 0) {
  let d = 0, k = s.indexOf('{', ai);
  for (let e = k; e < s.length && e < ai + 3000; e++) {
    if (s[e] === '{') { if (!d) { d = 1; } else d++; }
    else if (s[e] === '}') { d--; if (!d) { console.log('\n=== applyLang (@' + ai + ') ===\n' + s.slice(ai, e + 1).replace(/</g,'⏊')); break; } }
  }
}
