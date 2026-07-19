const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// T 对象 dump（修正正则：key 可能无引号）
const ti = 48906;
let d = 0, k = s.indexOf('{', ti);
let te = -1;
for (let e = k; e < s.length; e++) {
  if (s[e] === '{') { if (!d) { d = 1; } else d++; }
  else if (s[e] === '}') { d--; if (!d) { te = e; break; } }
}
const Tobj = s.slice(ti, te + 1);
// 抽取 zh 段
const zhStart = Tobj.indexOf('zh:') >= 0 ? Tobj.indexOf('zh:') : (Tobj.indexOf("'zh'") >= 0 ? Tobj.indexOf("'zh'") : Tobj.indexOf('"zh"'));
const enStart = Tobj.indexOf('en:') >= 0 ? Tobj.indexOf('en:') : (Tobj.indexOf("'en'") >= 0 ? Tobj.indexOf("'en'") : Tobj.indexOf('"en"'));
console.log('T zh 段起点 @', zhStart, ' en 段起点 @', enStart);
// 各打印前 1200 字节
console.log('\n--- zh 段 ---');
console.log(Tobj.slice(zhStart, zhStart + 1200).replace(/</g,'⏊'));
console.log('\n--- en 段 ---');
console.log(Tobj.slice(enStart, enStart + 1200).replace(/</g,'⏊'));

// 定位硬编码字符串 + 前后 120 字
const strs = ['症状搜药','输入症状','药品说明书查询','输入药品名称','添加药品','加入药箱','选择舌象','选择脉象','拍照识别','手动输入','正常','临期','过期','药箱'];
strs.forEach(str => {
  const re = new RegExp(str, 'g');
  let m, idx = 0, found = [];
  while ((m = re.exec(s)) && found.length < 3) {
    found.push({i: m.index, ctx: s.slice(Math.max(0, m.index - 60), Math.min(s.length, m.index + 80))});
  }
  console.log('\n=== "' + str + '" 共 ' + found.length + ' 处 ===');
  found.forEach((f, n) => {
    const hasId = /id="[^"]*"/.test(f.ctx);
    console.log('  [' + (n+1) + '] @' + f.i + ' 含id=' + hasId + ': ' + f.ctx.replace(/</g,'⏊').replace(/\n/g,' '));
  });
});
