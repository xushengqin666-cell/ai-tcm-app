const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 修复: 两个连续的 <h3 id="profileEditTitle">
// 删除第二个（多余的）
const badPattern = '<h3 id="profileEditTitle" style="margin:0;font-size:18px;color:var(--text-primary)">✏️ 编辑资料</h3>\n      <h3 id="profileEditTitle"';
const goodPattern = '<h3 id="profileEditTitle" style="margin:0;font-size:18px;color:var(--text-primary)">✏️ 编辑资料</h3>\n      ';

if (s.indexOf(badPattern) >= 0) {
  s = s.replace(badPattern, goodPattern);
  console.log('✅ 重复 h3 已删除');
} else {
  // 尝试不包含换行的版本
  const bad2 = '<h3 id="profileEditTitle" style="margin:0;font-size:18px;color:var(--text-primary)">✏️ 编辑资料</h3><h3 id="profileEditTitle"';
  if (s.indexOf(bad2) >= 0) {
    s = s.replace(bad2, '<h3 id="profileEditTitle" style="margin:0;font-size:18px;color:var(--text-primary)">✏️ 编辑资料</h3>');
    console.log('✅ 重复 h3 已删除 (无换行)');
  } else {
    // 找两处 profileEditTitle
    const idx1 = s.indexOf('<h3 id="profileEditTitle"');
    if (idx1 >= 0) {
      const idx2 = s.indexOf('<h3 id="profileEditTitle"', idx1 + 1);
      if (idx2 >= 0) {
        console.log('两个 h3: @', idx1, '和', idx2);
        // 删除第二个
        const before = s.slice(0, idx2);
        const after = s.slice(idx2 + '<h3 id="profileEditTitle" style="margin:0;font-size:18px;color:var(--text-primary)">✏️ 编辑资料</h3>'.length);
        s = before + after;
        console.log('✅ 第二个重复 h3 已删除');
      }
    }
  }
}

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
console.log('profileEditTitle count:', (s.match(/id="profileEditTitle"/g) || []).length);
