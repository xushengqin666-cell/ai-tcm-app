const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');
const p = s.indexOf("document.getElementById('profileEditBtn')");
console.log('profileEditBtn @:', p);
if (p >= 0) {
  console.log('context:', s.slice(p - 30, p + 150));
}
const hasProfileTitle = s.indexOf("document.getElementById('profileTitle')");
console.log('profileTitle @:', hasProfileTitle);
