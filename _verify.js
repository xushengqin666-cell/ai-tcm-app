const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const i = s.indexOf('function doSearch()');
// 提取到下一个 function 之前
const end = s.indexOf('\nfunction ', i + 20);
const code = s.slice(i, end);
// 用 Function 构造检测语法（不执行 DOM）
try {
  // 把可能引用的全局包一层
  new Function('searchInput','searchResult','findDrugManual','matchDrugsBySymptom','DRUG_SYNONYMS','escapeHtml','callAI','T','currentLang', code);
  console.log('✅ doSearch 语法 OK, 长度', code.length);
} catch (e) {
  console.log('❌ doSearch 语法错误:', e.message);
  console.log('问题代码片段:');
  console.log(code.slice(0, 800));
}
