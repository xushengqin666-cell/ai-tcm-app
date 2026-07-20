const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 找到 applyLang 函数并在末尾添加新元素处理
const applyLangIdx = s.indexOf('function applyLang(lang)');
if (applyLangIdx > 0) {
  // 找到函数结束位置
  let depth = 0, endIdx = applyLangIdx;
  for (let i = applyLangIdx; i < s.length; i++) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}') { depth--; if (depth === 0) { endIdx = i; break; } }
  }
  
  const currentFn = s.slice(applyLangIdx, endIdx + 1);
  
  // 检查是否已有新元素处理
  if (!currentFn.includes('reminderTitle')) {
    // 在函数末尾添加新元素处理（在最后的 } 之前）
    const newCode = `
  // Reminder tab
  if(el=document.getElementById('reminderTitle')) el.textContent = t.reminderTitle || '用药提醒';
  
  // Member tab  
  if(el=document.getElementById('memberTitle')) el.textContent = t.memberTitle || '家庭成员';
  if(el=document.getElementById('memberTip')) el.textContent = t.memberTip || '';
  
  // Cabinet tab
  if(el=document.getElementById('cabinetTitle')) el.textContent = t.cabinetTitle || '家庭药箱';
  if(el=document.getElementById('cabStatTotalLabel')) el.textContent = t.cabinetTotal || '药品总数';
  if(el=document.getElementById('cabStatWarnLabel')) el.textContent = t.cabinetWarn || '即将过期';
  if(el=document.getElementById('cabStatBadLabel')) el.textContent = t.cabinetBad || '已过期';
`;
    const insertPos = endIdx;
    s = s.slice(0, insertPos) + newCode + s.slice(insertPos);
    console.log('Extended applyLang with new elements');
  } else {
    console.log('applyLang already has new elements');
  }
}

fs.writeFileSync('index.html', s, 'utf8');
console.log('Done. File size:', s.length);
