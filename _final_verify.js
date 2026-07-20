const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

const checks = [
  'function openProfileEdit()',
  'function saveProfileEdit()',
  'function openReminder()',
  'function saveReminder()',
  'function openMember()',
  'function saveMember()',
  'function openCabinet()',
  'function addCabinetDrug()',
  'id="reminderModal"',
  'id="memberModal"',
  'id="profileEditModal"',
  'setInterval(checkReminders',  // 提醒检查循环
];

let allOk = true;
checks.forEach(pattern => {
  const found = s.includes(pattern);
  console.log(pattern.slice(0, 40) + ':', found ? 'OK' : 'MISSING');
  if (!found) allOk = false;
});

// 检查大括号
let depth = 0;
for (let i = 0; i < s.length; i++) {
  if (s[i] === '{') depth++;
  else if (s[i] === '}') depth--;
}
console.log('\nBraces balanced:', depth === 0 ? 'OK' : 'FAIL (' + depth + ')');

console.log('\nFile size:', s.length);
console.log(allOk && depth === 0 ? '\n✅ All checks passed' : '\n❌ Some checks failed');
