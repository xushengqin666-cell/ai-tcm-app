const fs = require('fs');
const s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 找 authGate script 里的 authTitle 引用
const gateScriptStart = s.indexOf('/* 水墨入场 + 登录/注册流程 */');
if (gateScriptStart > 0) {
  const gateScript = s.slice(gateScriptStart, gateScriptStart + 3000);
  console.log('authTitle refs in gate script:', (gateScript.match(/authTitle/g) || []).length);
  console.log(gateScript.slice(0, 500));
}
