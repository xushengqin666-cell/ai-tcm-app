const fs = require('fs');
let s = fs.readFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', 'utf8');

// 修复：把 Modal 里的 id="authTitle" 改为 id="modalAuthTitle"
// Modal 的 authTitle 在 profileModalInner 里
const oldModal = '<h3 id="authTitle" style="margin:0;font-size:18px;color:var(--text-primary)">🔐 登录</h3>';
const newModal = '<h3 id="modalAuthTitle" style="margin:0;font-size:18px;color:var(--text-primary)">🔐 登录</h3>';

if (s.indexOf(oldModal) >= 0) {
  s = s.replace(oldModal, newModal);
  console.log('✅ Modal authTitle 已改为 modalAuthTitle');
} else {
  // 尝试更宽泛的匹配
  const generic = '<h3 id="authTitle" style="margin:0;font-size:18px';
  if (s.indexOf(generic) >= 0) {
    s = s.replace(generic, '<h3 id="modalAuthTitle" style="margin:0;font-size:18px');
    console.log('✅ Modal authTitle (generic) 已改');
  } else {
    // 找到所有 id="authTitle" 的位置
    let idx = 0;
    let count = 0;
    while ((idx = s.indexOf('id="authTitle"', idx)) >= 0) {
      console.log(`Found id="authTitle" @${idx}:`, s.slice(idx - 20, idx + 60));
      count++;
      idx++;
    }
    console.log('Total:', count, '个 id="authTitle"');
  }
}

// 更新 T 键: modalAuthTitle 已存在, 但 applyLang 里的 t.authTitle 需要改成 t.modalAuthTitle
// 实际上 applyLang 里有 t.authTitle = "🔐 登录" (来自 modalAuthTitle 键)
// 只需把 ID 改了, t.authTitle 在 T 里映射到 modalAuthTitle
// 实际上 T 里是 modalAuthTitle: '🔐 登录', 所以 applyLang 需要查 t.modalAuthTitle
// 检查 T 里 modalAuthTitle 键
const tZhMatch = s.match(/modalAuthTitle:'([^']+)'/);
console.log('T.zh modalAuthTitle:', tZhMatch ? tZhMatch[1] : 'NOT FOUND');

fs.writeFileSync('C:/Users/xu_fa/ai-tcm-app/index.html', s, 'utf8');
console.log('文件大小:', s.length);
console.log('id="authTitle" remaining:', (s.match(/id="authTitle"/g) || []).length);
console.log('id="modalAuthTitle" remaining:', (s.match(/id="modalAuthTitle"/g) || []).length);
