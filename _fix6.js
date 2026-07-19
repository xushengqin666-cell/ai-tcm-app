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

// ===== 修复1：在 doSearch 里用 matchDrugsBySymptom 替代不存在的 searchBySymptomData =====
// doSearch 第2段：var symResults = searchBySymptomData(q);
rep(
"  // 2) 药库无果，问症状搜药\r\n  var symResults = searchBySymptomData(q);",
"  // 2) 药库无果，症状匹配\r\n  var symResults = [];\r\n  try { symResults = (typeof matchDrugsBySymptom === 'function') ? matchDrugsBySymptom(q) : []; } catch(ex) { symResults = []; }",
'doSearch 第2段用 matchDrugsBySymptom'
);

// 把 symResults 渲染调整：symResults 是 [{name, score, drug}] 格式，不是 [{name, indications}]
rep(
"    symResults.slice(0,5).forEach(function(d){\r\n      sh += '<div class=\"card\" style=\"background:#F2F3F5;color:#1A1A1A;padding:12px;margin-bottom:8px;border-radius:10px\">';\r\n      sh += '<div style=\"font-weight:700;color:#07C160\">💊 '+d.name+'</div>';\r\n      if(d.indications) sh += '<div style=\"font-size:13px;margin-top:4px\">'+escapeHtml(d.indications)+'</div>';\r\n      sh += '</div>';\r\n    });",
"    symResults.slice(0,5).forEach(function(it){\r\n      var dd = it.drug || it;\r\n      sh += '<div class=\"card\" style=\"background:#F2F3F5;color:#1A1A1A;padding:12px;margin-bottom:8px;border-radius:10px\">';\r\n      sh += '<div style=\"font-weight:700;color:#07C160\">💊 '+escapeHtml(it.name || dd.name)+'</div>';\r\n      if(dd.indications) sh += '<div style=\"font-size:13px;margin-top:4px\">'+escapeHtml(dd.indications)+'</div>';\r\n      if(dd.dosage) sh += '<div style=\"font-size:13px;margin-top:4px\"><b>用法:</b> '+escapeHtml(dd.dosage)+'</div>';\r\n      sh += '</div>';\r\n    });",
'doSearch 第2段渲染适配 matchDrugsBySymptom 格式'
);

// ===== 修复2：辨证报告 TCMEngine 错误加友好提示 + fallback =====
// 当前是 catch(e) { rResultDiv.innerHTML = '<p style="color:red">引擎错误: ' + e.message + '</p>'; }
rep(
"    } catch(e) { rResultDiv.innerHTML = '<p style=\"color:red\">引擎错误: ' + e.message + '</p>'; }",
"    } catch(e) {\r\n      var isEngineMissing = (e && (e.message||'').indexOf('TCMEngine') >= 0);\r\n      if(isEngineMissing){\r\n        rResultDiv.innerHTML = '<div style=\"background:#FFF3E0;padding:16px;border-radius:12px;border-left:4px solid #FF9800\"><h4 style=\"color:#E65100;margin-bottom:8px\">⚠️ 辨证引擎未加载</h4><p style=\"font-size:13px;color:#555;margin:4px 0\">可能原因：网络慢或脚本加载失败。</p><p style=\"font-size:13px;color:#555;margin:4px 0\">建议：<b>刷新页面重试</b>，或检查网络。</p><p style=\"font-size:12px;color:#999;margin-top:8px\">技术详情: '+e.message+'</p></div>';\r\n      } else {\r\n        rResultDiv.innerHTML = '<p style=\"color:red\">引擎错误: ' + e.message + '</p>';\r\n      }\r\n    }",
'辨证报告 TCMEngine 错误友好提示'
);

fs.writeFileSync('index.html', s);
console.log('\n共改 ' + n + ' 处');
// 语法校验
const scripts = s.match(/<script>([\s\S]*?)<\/script>/g) || [];
let ok = true;
scripts.forEach((b, i) => {
  const c = b.replace(/^<script>/, '').replace(/<\/script>$/, '');
  try { new Function(c); } catch (e) { ok = false; console.log('script#' + (i + 1) + ' ❌ ' + e.message); }
});
['matchDrugsBySymptom(q)', '辨证引擎未加载', '刷新页面重试', 'TCMEngine'].forEach(k => console.log((s.includes(k) ? '✅ ' : '❌ ') + k));
console.log(ok ? '语法全 ✅' : '语法错误 ❌');
console.log('size: ' + (s.length / 1024).toFixed(1) + 'KB');
