const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');

// 主脚本块：开标签在 44156，闭标签在 515987
const mainOpen = s.indexOf('<script>', 40000);           // 主 <script>
const mainCloseStart = s.indexOf('</script>', mainOpen); // 主 </script> 起点
const mainCloseEnd = mainCloseStart + 9;                // 含 </script>
const mainBlock = s.slice(mainOpen, mainCloseEnd);

console.log('主脚本块: @' + mainOpen + '~@' + mainCloseEnd + ' 长度', mainBlock.length);

// 目标插入点：脚本6 的 <script> 之前（@520715 附近）
const target = s.indexOf('<script>', mainCloseEnd); // 第一个在 main 之后的 <script> = 脚本6
console.log('插入点 @', target);

// 把主脚本块从原位删除，插到 target 前
const before = s.slice(0, mainOpen);
const middle = s.slice(mainCloseEnd, target);  // tab HTML（report/cabinet/member/reminder）
const after = s.slice(target);
const ns = before + middle + '\r\n' + mainBlock + '\r\n' + after;

fs.writeFileSync('index.html', ns, 'utf8');
console.log('✅ 已移动主脚本到 tab HTML 之后。新字节:', Buffer.byteLength(ns, 'utf8'));
console.log('移动后主脚本位置: @' + (before.length + middle.length + 2));
