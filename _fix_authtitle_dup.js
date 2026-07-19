const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
const before = s.length;

// 旧的 authGate 使用 id="authTitle" = "彩云智药" 
// 新的 Modal 使用 id="authTitle" = "🔐 登录" - 冲突!
// 把新的 Modal 里的 id="authTitle" 改为 id="modalAuthTitle"

s = s.replace(/<h2 id="authTitle">🔐 登录<\/h2>/g, '<h2 id="modalAuthTitle">🔐 登录</h2>');

// 更新 T.zh/T.en: authTitle -> modalAuthTitle
s = s.replace(/modalAuthTitle:'🔐 登录'/g, "authTitle:'🔐 登录'"); // 先还原
s = s.replace(/authTitle:'🔐 登录'/g, "modalAuthTitle:'🔐 登录'");
s = s.replace(/authTitle:'🔐 Login'/g, "modalAuthTitle:'🔐 Login'");

// 更新 applyLang
s = s.replace(/if\(el=document\.getElementById\('authTitle'\)\) el\.textContent = t\.authTitle;/g,
  "if(el=document.getElementById('modalAuthTitle')) el.textContent = t.authTitle;");

// 更新 t.authTitle -> t.modalAuthTitle 在翻译赋值处
// 只改 applyLang 里的 (不是 T 对象定义)
const applyLangStart = s.indexOf('function applyLang');
const toggleLangIdx = s.indexOf('function toggleLang', applyLangStart);
const applyLangPart = s.slice(applyLangStart, toggleLangIdx);

// 找 t.authTitle 在 applyLang 里的位置
const tAuthTitleIdx = applyLangPart.indexOf("el.getElementById('modalAuthTitle')");
if (tAuthTitleIdx >= 0) {
  console.log('✅ modalAuthTitle 在 applyLang 中已更新');
}

// 再次确认 applyLang 里的 authTitle
const newApplyLangPart = s.slice(applyLangStart, toggleLangIdx);
const authTitleApply = (newApplyLangPart.match(/authTitle/g) || []).length;
console.log('applyLang 中 authTitle 引用次数:', authTitleApply);

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length, '(diff:', s.length - before, ')');

// 验证
const finalCheck = s.match(/id="authTitle"/g);
const modalCheck = s.match(/id="modalAuthTitle"/g);
console.log('id="authTitle" 剩余:', (finalCheck || []).length, '(旧 authGate)');
console.log('id="modalAuthTitle":', (modalCheck || []).length, '(新 Modal)');
