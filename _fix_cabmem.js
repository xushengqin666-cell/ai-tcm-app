const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
const RN = '\r\n';

// 锚点：renderMembers 里重建 cabMember 的 innerHTML
const old = "sel.innerHTML='<option value=\"\">（不指定）</option>'+members.map(function(nm){return '<option'+(nm===current?' selected':'')+'>'+esc(nm)+'</option>';}).join(''); }";
const cnt = s.split(old).length - 1;
console.log('锚点出现次数:', cnt);
if (cnt !== 1) { console.log('❌ 锚点非唯一'); process.exit(1); }
const nw = "sel.innerHTML='<option value=\"\">（不指定）</option>'+members.map(function(nm){return '<option'+(nm===current?' selected':'')+'>'+esc(nm)+'</option>';}).join(''); try{applyLang(currentLang);}catch(e){console.error('re-translate err:',e);} }";
s = s.replace(old, nw);
fs.writeFileSync('index.html', s, 'utf8');
console.log('✅ renderMembers 重建后追加 applyLang 调用完成');
console.log('文件大小:', s.length);
