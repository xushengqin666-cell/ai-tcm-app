const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 1. 在底部导航添加"我的"按钮（处理 CRLF）
const oldNavEnd = `id="navReminder">提醒</span></a>\r\n</div>`;
const newNavEnd = `id="navReminder">提醒</span></a>\r\n  <a href="javascript:void(0)" data-tab="profile" onclick="openProfile()">👤 <span id="navProfile">我的</span></a>\r\n</div>`;

if (s.indexOf(oldNavEnd) >= 0) {
  s = s.replace(oldNavEnd, newNavEnd);
  console.log('✅ 底部导航"我的"已添加');
} else {
  console.log('⚠️ 底部导航模式未找到，尝试 LF 版本');
  const oldNavEnd2 = `id="navReminder">提醒</span></a>\n</div>`;
  const newNavEnd2 = `id="navReminder">提醒</span></a>\n  <a href="javascript:void(0)" data-tab="profile" onclick="openProfile()">👤 <span id="navProfile">我的</span></a>\n</div>`;
  if (s.indexOf(oldNavEnd2) >= 0) {
    s = s.replace(oldNavEnd2, newNavEnd2);
    console.log('✅ 底部导航"我的"已添加 (LF)');
  } else {
    console.log('⚠️ LF 版本也未找到');
  }
}

// 2. 在 applyLang 中添加 navProfile（处理 CRLF）
const oldApply = "if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;\r\n}\r\nwindow.applyLang = applyLang;";
const newApply = "if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;\r\nif(el=document.getElementById('navProfile')) el.textContent = t.navProfile;\r\n}\r\nwindow.applyLang = applyLang;";
if (s.indexOf(oldApply) >= 0) {
  s = s.replace(oldApply, newApply);
  console.log('✅ applyLang navProfile 已添加');
} else {
  console.log('⚠️ applyLang CRLF 模式未找到，尝试 LF 版本');
  const oldApply2 = "if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;\n}\nwindow.applyLang = applyLang;";
  const newApply2 = "if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;\nif(el=document.getElementById('navProfile')) el.textContent = t.navProfile;\n}\nwindow.applyLang = applyLang;";
  if (s.indexOf(oldApply2) >= 0) {
    s = s.replace(oldApply2, newApply2);
    console.log('✅ applyLang navProfile 已添加 (LF)');
  } else {
    console.log('⚠️ LF 版本也未找到');
  }
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
