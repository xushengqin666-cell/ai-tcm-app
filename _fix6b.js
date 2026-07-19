const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
let n = 0;
function rep(a, b, label) {
  if (s.indexOf(a) < 0) { console.log('❌ 未找到: ' + label); return false; }
  s = s.replace(a, b);
  n++;
  console.log('✅ ' + label);
  return true;
}

rep(
"  // 2) 药库无果，问症状搜药\n  var symResults = searchBySymptomData(q);",
"  // 2) 药库无果，症状匹配\n  var symResults = [];\n  try { symResults = (typeof matchDrugsBySymptom === 'function') ? matchDrugsBySymptom(q) : []; } catch(ex) { symResults = []; }",
'doSearch 第2段用 matchDrugsBySymptom'
);

rep(
"    symResults.slice(0,5).forEach(function(d){\n      sh += '<div class=\"card\" style=\"background:#F2F3F5;color:#1A1A1A;padding:12px;margin-bottom:8px;border-radius:10px\">';\n      sh += '<div style=\"font-weight:700;color:#07C160\">💊 '+d.name+'</div>';\n      if(d.indications) sh += '<div style=\"font-size:13px;margin-top:4px\">'+escapeHtml(d.indications)+'</div>';\n      sh += '</div>';\n    });",
"    symResults.slice(0,5).forEach(function(it){\n      var dd = it.drug || it;\n      sh += '<div class=\"card\" style=\"background:#F2F3F5;color:#1A1A1A;padding:12px;margin-bottom:8px;border-radius:10px\">';\n      sh += '<div style=\"font-weight:700;color:#07C160\">💊 '+escapeHtml(it.name || dd.name)+'</div>';\n      if(dd.indications) sh += '<div style=\"font-size:13px;margin-top:4px\">'+escapeHtml(dd.indications)+'</div>';\n      if(dd.dosage) sh += '<div style=\"font-size:13px;margin-top:4px\"><b>用法:</b> '+escapeHtml(dd.dosage)+'</div>';\n      sh += '</div>';\n    });",
'doSearch 第2段渲染适配'
);

fs.writeFileSync('index.html', s);
console.log('\n共改 ' + n + ' 处');
const scripts = s.match(/<script>([\s\S]*?)<\/script>/g) || [];
let ok = true;
scripts.forEach((b, i) => {
  const c = b.replace(/^<script>/, '').replace(/<\/script>$/, '');
  try { new Function(c); } catch (e) { ok = false; console.log('script#' + (i + 1) + ' ❌ ' + e.message); }
});
['matchDrugsBySymptom(q)', 'it.drug || it', '辨证引擎未加载'].forEach(k => console.log((s.includes(k) ? '✅ ' : '❌ ') + k));
console.log(ok ? '语法全 ✅' : '语法错误 ❌');
console.log('size: ' + (s.length / 1024).toFixed(1) + 'KB');
