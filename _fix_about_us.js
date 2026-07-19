const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 修复 T.en 中的 profileAbout (在 configTitle:'🤖 AI Config' 附近)
const wrongAbout = "profileAbout:'About',profileLogout:'Logout',";
const rightAbout = "profileAbout:'About Us',profileLogout:'Logout',";
if (s.indexOf(wrongAbout) >= 0) {
  s = s.replace(wrongAbout, rightAbout);
  console.log('✅ profileAbout 已修复');
} else {
  console.log('⚠️ 未找到 profileAbout:About');
}

// 验证
const aboutMatches = [];
let pos = 0;
while (true) {
  const idx = s.indexOf("profileAbout:'", pos);
  if (idx < 0) break;
  aboutMatches.push({ pos, val: s.slice(idx, idx + 30) });
  pos = idx + 1;
}
console.log('所有 profileAbout:', aboutMatches);

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
