const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 检查各种可能的 ID
const ids = ['symptomInput', 'symptomSearchBtn', 'interactDrug1', 'interactDrug2', 'interactBtn', 'interactResult', 'profileTitle', 'profileEditBtn'];
ids.forEach(id => {
  const idx = s.indexOf('id="' + id + '"');
  if (idx >= 0) {
    console.log('✅', id, '@', idx, ':', s.slice(idx, idx + 50));
  } else {
    console.log('❌', id, '未找到');
  }
});
