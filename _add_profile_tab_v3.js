const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 1. 在底部导航添加"我的"按钮
const oldNavEnd = `⏰ <span id="navReminder">提醒</span></a>
</div>`;
const newNavEnd = `⏰ <span id="navReminder">提醒</span></a>
  <a href="javascript:void(0)" data-tab="profile" onclick="openProfile()">👤 <span id="navProfile">我的</span></a>
</div>`;

if (s.indexOf(oldNavEnd) >= 0) {
  s = s.replace(oldNavEnd, newNavEnd);
  console.log('✅ 底部导航"我的"已添加');
} else {
  console.log('⚠️ 底部导航模式未找到');
}

// 2. 在 applyLang 中添加 navProfile
const oldApply = "if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;\n}\nwindow.applyLang = applyLang;";
const newApply = "if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;\nif(el=document.getElementById('navProfile')) el.textContent = t.navProfile;\n}\nwindow.applyLang = applyLang;";
if (s.indexOf(oldApply) >= 0) {
  s = s.replace(oldApply, newApply);
  console.log('✅ applyLang navProfile 已添加');
} else {
  console.log('⚠️ applyLang 插入点未找到');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
