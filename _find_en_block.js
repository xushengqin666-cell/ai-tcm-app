const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找 navHome:'Home' 的位置
const navHomeEnIdx = s.indexOf("navHome:'Home'");
console.log('navHome Home @:', navHomeEnIdx);
console.log('前后 300 字:', s.slice(navHomeEnIdx - 100, navHomeEnIdx + 300));
