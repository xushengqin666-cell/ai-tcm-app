const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
let cnt = 0;

// ===== Fix 2: doSearch 口语化症状抽取 =====
const a2 = '// 2) 药库无果，症状匹配';
const e2 = '} catch(ex) { symResults = []; }';
const i2 = s.indexOf(a2);
const j2 = s.indexOf(e2, i2) + e2.length;
if (i2 >= 0 && j2 > i2) {
  const old2 = s.slice(i2, j2);
  const new2 = '// 2) 药库无果，症状匹配（支持"我的脚疼""头疼怎么办"等口语）\r\n  var symResults = [];\r\n  try {\r\n    symResults = (typeof matchDrugsBySymptom === \'function\') ? matchDrugsBySymptom(q) : [];\r\n    if(!symResults || !symResults.length){\r\n      var _cleaned = q.replace(/^(我的|我|我想|请问|帮我|我想知道|我想了解|我想问|请问一下|谁知道)/,\'\').replace(/(怎么办|怎么治疗|如何治疗|怎么治|吃什么药|该吃什么|吃啥|咋办|怎么缓解|如何缓解|的症状|应该|可以吗|吗|呢)$/,\'\').trim();\r\n      symResults = matchDrugsBySymptom(_cleaned);\r\n    }\r\n    if(!symResults || !symResults.length){\r\n      var _hits = [];\r\n      if(typeof DRUG_SYNONYMS !== \'undefined\'){ for(var _sk in DRUG_SYNONYMS){ if(q.indexOf(_sk) >= 0) _hits.push(_sk); } }\r\n      if(_hits.length) symResults = matchDrugsBySymptom(_hits.join(\' \'));\r\n    }\r\n  } catch(ex) { symResults = []; }';
  s = s.slice(0, i2) + new2 + s.slice(j2);
  cnt++; console.log('Fix2 OK, 替换', old2.length, '字节');
} else console.log('Fix2 锚点未找到');

// ===== Fix 3: sendChat 改用 callWorker + 降级 =====
const a3 = '// 调用 Groq API';
const e3 = "document.getElementById(loadingId).querySelector('.bubble').textContent = answer;";
const i3 = s.indexOf(a3);
const j3 = s.indexOf(e3, i3) + e3.length;
if (i3 >= 0 && j3 > i3) {
  const new3 = "    // 调用 AI（零密钥：走 Cloudflare Worker 代理，失败降级 callAI→本地）\r\n    let finalAnswer;\r\n    try {\r\n      const _resp = await callWorker(question);\r\n      finalAnswer = (_resp && _resp.answer) ? _resp.answer : '抱歉，未能获取回答。';\r\n    } catch (_e1) {\r\n      try {\r\n        const _resp2 = await callAI(question);\r\n        finalAnswer = (_resp2 && _resp2.answer) ? _resp2.answer : '抱歉，AI 服务暂时不可用，请稍后再试。';\r\n      } catch (_e2) {\r\n        finalAnswer = '抱歉，AI 服务暂时不可用，请稍后再试。';\r\n      }\r\n    }\r\n\r\n    // 更新消息\r\n      document.getElementById(loadingId).querySelector('.bubble').textContent = finalAnswer;";
  s = s.slice(0, i3) + new3 + s.slice(j3);
  cnt++; console.log('Fix3 OK, 替换', (j3 - i3), '字节');
} else console.log('Fix3 锚点未找到');

if (cnt === 2) {
  fs.writeFileSync('index.html', s, 'utf8');
  console.log('✅ 已写入 index.html，字节:', Buffer.byteLength(s, 'utf8'));
} else {
  console.log('❌ 仅匹配', cnt, '处，未写入');
}
