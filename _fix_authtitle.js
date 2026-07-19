const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 旧的 authTitle 是 authGate (登录弹窗)的标题 "彩云智药" - 保留它,改名
// 改名为 gateTitle
s = s.replace(/authTitle:'彩云智药'/g, "gateTitle:'彩云智药'");
s = s.replace(/authTitle:'Caiyun Smart Pharmacy'/g, "gateTitle:'Caiyun Smart Pharmacy'");

// 同时找到引用 authTitle 的地方，改成 gateTitle
const authTitleCount = (s.match(/authTitle/g) || []).length;
console.log('修改前 authTitle 引用次数:', authTitleCount);

// 找到引用 authTitle 的地方（不是字符串定义的位置）
// 先简单替换所有非字符串位置的引用：'authTitle' -> 'gateTitle'（在 T 对象外部）
// 在 T 对象定义里，authTitle 是字符串："authTitle" (带引号)
// 其他地方是对象属性访问：t.authTitle
// 改 t.authTitle 改为 t.gateTitle
s = s.replace(/t\.authTitle\b/g, 't.gateTitle');

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('修改后:');
console.log('  authTitle 字符串定义:', (s.match(/authTitle:'/g) || []).length);
console.log('  gateTitle 字符串定义:', (s.match(/gateTitle:'/g) || []).length);
console.log('  t.authTitle 引用:', (s.match(/t\.authTitle\b/g) || []).length);
console.log('  t.gateTitle 引用:', (s.match(/t\.gateTitle\b/g) || []).length);
console.log('  file size:', s.length);
