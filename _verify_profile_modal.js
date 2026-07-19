const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 检查 Profile Modal
const pmIdx = s.indexOf('id="profileModal"');
if (pmIdx > 0) {
  console.log('=== Profile Modal HTML ===');
  console.log(s.slice(pmIdx, pmIdx + 3000));
}

// 检查 Profile Modal 函数 openProfile, editProfile
const openProfileIdx = s.indexOf('function openProfile');
if (openProfileIdx > 0) {
  console.log('\n=== openProfile 函数 ===');
  console.log(s.slice(openProfileIdx, openProfileIdx + 500));
}

const editProfileIdx = s.indexOf('function editProfile');
if (editProfileIdx > 0) {
  console.log('\n=== editProfile 函数 ===');
  console.log(s.slice(editProfileIdx, editProfileIdx + 500));
}
