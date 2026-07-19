const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 找到 applyLang 中处理 tongueSelect 的部分并替换
const oldTongueCode = `if(el=document.getElementById('tongueSelect')) {
    var opts = el.querySelectorAll('option');
    if(opts[0]) opts[0].textContent = t.tonguePlaceholder;
  }`;

const newTongueCode = `if(el=document.getElementById('tongueSelect')) {
    var opts = el.querySelectorAll('option');
    if(opts[0]) opts[0].textContent = t.tonguePlaceholder;
    // 翻译其他选项
    for(var i=1;i<opts.length;i++){
      var key=opts[i].value;
      if(t.tongueMap && t.tongueMap[key]) opts[i].textContent = t.tongueMap[key];
    }
  }`;

if (s.indexOf(oldTongueCode) >= 0) {
  s = s.replace(oldTongueCode, newTongueCode);
  console.log('✅ tongueSelect 处理已更新');
} else {
  console.log('⚠️ 未找到旧的 tongueSelect 代码');
}

// 同样更新 pulseSelect
const oldPulseCode = `if(el=document.getElementById('pulseSelect')) {
    var opts = el.querySelectorAll('option');
    if(opts[0]) opts[0].textContent = t.pulsePlaceholder;
  }`;

const newPulseCode = `if(el=document.getElementById('pulseSelect')) {
    var opts = el.querySelectorAll('option');
    if(opts[0]) opts[0].textContent = t.pulsePlaceholder;
    // 翻译其他选项
    for(var i=1;i<opts.length;i++){
      var key=opts[i].value;
      if(t.pulseMap && t.pulseMap[key]) opts[i].textContent = t.pulseMap[key];
    }
  }`;

if (s.indexOf(oldPulseCode) >= 0) {
  s = s.replace(oldPulseCode, newPulseCode);
  console.log('✅ pulseSelect 处理已更新');
} else {
  console.log('⚠️ 未找到旧的 pulseSelect 代码');
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('文件大小:', s.length);
