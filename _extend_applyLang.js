const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 找到 applyLang 函数的结尾（在函数体内的最后一个 if 语句之后）
const funcStart = s.indexOf('function applyLang(lang){');
const funcBodyStart = s.indexOf('{', funcStart) + 1;

// 找函数结尾（匹配大括号）
let depth = 1;
let funcEnd = funcBodyStart;
for (let i = funcBodyStart; i < s.length; i++) {
  if (s[i] === '{') depth++;
  else if (s[i] === '}') { depth--; if (!depth) { funcEnd = i; break; } }
}

console.log('applyLang 函数范围:', funcStart, '-', funcEnd);

// 要添加的新翻译项（对应 T 对象中的新键）
const newTranslations = `
  // 症状搜药
  if(el=document.getElementById('homeSymptomTitle')) el.textContent = t.homeSymptomTitle;
  if(el=document.getElementById('homeSymptomInput')) el.placeholder = t.homeSymptomPlaceholder;
  if(el=document.getElementById('homeSymptomBtn')) el.textContent = t.homeSymptomBtn;
  // 药品说明书查询
  if(el=document.getElementById('manualTitle')) el.textContent = t.manualTitle;
  if(el=document.getElementById('manualInput')) el.placeholder = t.manualPlaceholder;
  if(el=document.getElementById('manualBtn')) el.textContent = t.manualBtn;
  // 药箱添加表单
  if(el=document.getElementById('cabAddTitle')) el.textContent = t.cabAddTitle;
  if(el=document.getElementById('cabNameLabel')) el.textContent = t.cabNameLabel;
  if(el=document.getElementById('cabNameInput')) el.placeholder = t.cabNamePlaceholder;
  if(el=document.getElementById('cabSpecLabel')) el.textContent = t.cabSpecLabel;
  if(el=document.getElementById('cabSpecInput')) el.placeholder = t.cabSpecPlaceholder;
  if(el=document.getElementById('cabQtyLabel')) el.textContent = t.cabQtyLabel;
  if(el=document.getElementById('cabQtyInput')) el.placeholder = t.cabQtyPlaceholder;
  if(el=document.getElementById('cabExpiryLabel')) el.textContent = t.cabExpiryLabel;
  if(el=document.getElementById('cabMemberLabel')) el.textContent = t.cabMemberLabel;
  if(el=document.getElementById('cabAddBtn')) el.textContent = t.cabAddBtn;
  // 统计卡片
  if(el=document.getElementById('cabStatOk')) el.textContent = t.cabStatOk;
  if(el=document.getElementById('cabStatWarn')) el.textContent = t.cabStatWarn;
  if(el=document.getElementById('cabStatBad')) el.textContent = t.cabStatBad;
  // 舌象脉象选择器
  if(el=document.getElementById('tongueSelect')) {
    var opts = el.querySelectorAll('option');
    if(opts[0]) opts[0].textContent = t.tonguePlaceholder;
  }
  if(el=document.getElementById('pulseSelect')) {
    var opts = el.querySelectorAll('option');
    if(opts[0]) opts[0].textContent = t.pulsePlaceholder;
  }
  // AI Chat 按钮
  if(el=document.getElementById('cameraBtn')) el.textContent = t.cameraBtn;
  if(el=document.getElementById('manualInputBtn')) el.textContent = t.manualInputBtn;
  // 底部导航
  if(el=document.getElementById('navHome')) el.textContent = t.navHome;
  if(el=document.getElementById('navInsert')) el.textContent = t.navInsert;
  if(el=document.getElementById('navCabinet')) el.textContent = t.navCabinet;
  if(el=document.getElementById('navMember')) el.textContent = t.navMember;
  if(el=document.getElementById('navReminder')) el.textContent = t.navReminder;
`;

// 在函数结尾的 } 之前插入新代码
const beforeClosing = s.slice(0, funcEnd);
const afterClosing = s.slice(funcEnd);

// 检查是否已存在这些新代码
if (s.indexOf('homeSymptomTitle') > funcStart && s.indexOf('homeSymptomTitle') < funcEnd) {
  console.log('✅ 新翻译代码已存在，跳过');
} else {
  s = beforeClosing + newTranslations + afterClosing;
  console.log('✅ 新翻译代码已插入');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);

// 语法检查
try {
  const testFunc = s.slice(funcStart, funcEnd + newTranslations.length + 10);
  require('vm').compileFunction('return ' + testFunc, []);
  console.log('✅ 语法检查通过');
} catch(e) {
  console.log('⚠️ 语法检查:', e.message.slice(0, 100));
}

process.exit(0);
