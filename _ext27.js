const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// 找所有 <script 标签
const scriptTags = [];
let from = 0;
while ((from = s.indexOf('<script', from)) >= 0) {
  const end = s.indexOf('>', from);
  const tag = s.slice(from, end + 1);
  scriptTags.push({ pos: from, tag: tag.slice(0, 80) });
  from = end + 1;
}
console.log('=== <script> 标签 ===');
scriptTags.forEach((t, i) => console.log((i + 1) + ' @' + t.pos + ' ' + t.tag));

// 找第一个 body 标签和 searchInput 元素位置
const bodyIdx = s.indexOf('<body');
const searchInputEl = s.indexOf('id="searchInput"');
const scriptBlockStart = s.lastIndexOf('<script>', searchInputEl); // 最后一个 script 块（含主逻辑）
console.log('\nbody @', bodyIdx, '| searchInput @', searchInputEl);

// 主逻辑 script 是否在 searchInput 之前还是之后
// 找包含 var searchInput = ... 的那段
const vi = s.indexOf("var searchInput");
console.log('\nvar searchInput @', vi);
// 这段 script 的开头
const blockStart = s.lastIndexOf('<script>', vi);
console.log('该 script 块开头 @', blockStart);
console.log('script 在 searchInput 元素之前? ', blockStart < searchInputEl ? '是（可能取不到元素）' : '否（OK）');

// 是否有 DOMContentLoaded 包裹
const dcl = s.indexOf('DOMContentLoaded');
console.log('使用 DOMContentLoaded 包裹? ', dcl >= 0 ? ('是 @' + dcl) : '否');

// 看 var searchInput 前后 200 字
console.log('\n=== var searchInput 上下文 ===');
console.log(s.slice(vi - 100, vi + 300));
