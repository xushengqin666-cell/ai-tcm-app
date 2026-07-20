const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 检查大括号平衡
let depth = 0;
for (let i = 0; i < s.length; i++) {
  if (s[i] === '{') depth++;
  else if (s[i] === '}') depth--;
  if (depth < 0) {
    console.log('ERROR: Unbalanced braces at position', i);
    console.log('Context:', s.slice(Math.max(0,i-50), i+50));
    process.exit(1);
  }
}
console.log('Braces balanced:', depth === 0 ? 'OK' : 'FAIL (' + depth + ')');

// 检查关键函数存在
const checks = [
  ['openProfileEdit', 'function openProfileEdit()'],
  ['saveProfileEdit', 'function saveProfileEdit()'],
  ['openReminder', 'function openReminder()'],
  ['addReminder', 'function saveReminder()'],
  ['openMember', 'function openMember()'],
  ['addMember', 'function saveMember()'],
  ['openCabinet', 'function openCabinet()'],
  ['addCabinetDrug', 'function addCabinetDrug()'],
  ['reminderModal', 'id="reminderModal"'],
  ['memberModal', 'id="memberModal"'],
  ['profileEditModal', 'id="profileEditModal"'],
];

checks.forEach(([name, pattern]) => {
  const found = s.includes(pattern);
  console.log(name + ':', found ? 'OK' : 'MISSING');
});

// 尝试解析 T 对象
const tMatch = s.match(/var T = \{([\s\S]+?)\};\s*var currentLang/);
if (tMatch) {
  try {
    const tCode = 'var T = {' + tMatch[1] + '};';
    new Function(tCode + '; return T;')();
    console.log('T object: OK');
  } catch(e) {
    console.log('T object ERROR:', e.message);
  }
}

console.log('\nFile size:', s.length);
