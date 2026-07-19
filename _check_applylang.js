const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const p = s.indexOf("getElementById('tongueSelect')");
console.log('tongueSelect in applyLang @' + p + ':');
if (p > 0) {
  console.log(s.slice(p - 50, p + 250));
} else {
  console.log('Not found in applyLang');
}
