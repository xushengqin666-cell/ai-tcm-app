const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const ids = ['authTitle','authSub','authTabLogin','authTabRegister','authPhonePh','authPwdPh','authPwd2Ph','authSubmitBtn','authSkipBtn'];
ids.forEach(id => {
  const p = s.indexOf('id="' + id + '"');
  if (p >= 0) {
    console.log(id + ' @' + p + ': ' + s.slice(Math.max(0, p - 80), p + 80).replace(/</g, '<'));
  } else {
    console.log(id + ': ❌ 缺失');
  }
});
process.exit(0);
