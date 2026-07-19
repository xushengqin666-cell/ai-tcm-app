const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找症状输入框
const patterns = [
  'id="reportSymptom"',
  'id="symptomInput"', 
  'placeholder.*口干',
  'Symptoms.*comma-separated'
];

patterns.forEach(p => {
  const idx = s.indexOf(p);
  if (idx >= 0) {
    console.log('Found "' + p + '" @' + idx + ':');
    console.log(s.slice(idx - 30, idx + 100));
    console.log('---');
  }
});
