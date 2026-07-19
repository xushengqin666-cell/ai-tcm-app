const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
const before = s.length;

// Bug 1: Profile Edit Modal 的外层 div 没有 id="profileEditModal"
// closeProfileModal() 查找 id="profileEditModal" 失败
// 修复: 在 profileEditTitle 之前的外层 div 添加 id="profileEditModal"
const oldProfileWrapper = '<div id="profileEditTitle" style="margin:0;font-size:18px;color:var(--text-primary)">✏️ 编辑资料</h3>';
const newProfileWrapper = '<div id="profileEditModal" class="modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;align-items:center;justify-content:center"><div class="modal-content" style="max-width:340px;padding:24px;background:var(--card-bg,#fff);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.2);position:relative;width:90%"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><h3 id="profileEditTitle" style="margin:0;font-size:18px;color:var(--text-primary)">✏️ 编辑资料</h3>';

if (s.indexOf(oldProfileWrapper) >= 0) {
  s = s.replace(oldProfileWrapper, newProfileWrapper);
  console.log('✅ Profile Modal ID 已修复 (添加 profileEditModal wrapper)');
} else {
  console.log('⚠️ Profile wrapper 锚点未找到, 尝试备用方案');
  // 找 <h3 id="profileEditTitle"
  const idx = s.indexOf('<h3 id="profileEditTitle"');
  if (idx > 0) {
    // 往前找最近的 <div 开标签
    const beforeContent = s.slice(Math.max(0, idx - 500), idx);
    const divCount = (beforeContent.match(/<div/g) || []).length;
    const closeDivCount = (beforeContent.match(/<\/div>/g) || []).length;
    console.log('  <div>:', divCount, '</div>:', closeDivCount);
    // 在 <h3 前插入外层 modal wrapper
    const wrapper = '<div id="profileEditModal" class="modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;align-items:center;justify-content:center"><div class="modal-content" style="max-width:340px;padding:24px;background:var(--card-bg,#fff);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.2);position:relative;width:90%">';
    s = s.slice(0, idx) + wrapper + s.slice(idx);
    console.log('✅ Profile Modal wrapper 已添加 (备用方案)');
  }
}

// Bug 2: openAuthModal() 使用 id="authTitle" 但现在改名为 modalAuthTitle
// 修复: 改用 modalAuthTitle
const oldOpenAuth = "const title = document.getElementById('authTitle');";
const newOpenAuth = "const title = document.getElementById('modalAuthTitle');";
if (s.indexOf(oldOpenAuth) >= 0) {
  s = s.replace(oldOpenAuth, newOpenAuth);
  console.log('✅ openAuthModal authTitle → modalAuthTitle');
} else {
  console.log('⚠️ openAuthModal 锚点未找到');
}

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length, '(diff:', s.length - before, ')');
console.log('profileEditModal count:', (s.match(/id="profileEditModal"/g) || []).length);
console.log('modalAuthTitle count:', (s.match(/id="modalAuthTitle"/g) || []).length);
