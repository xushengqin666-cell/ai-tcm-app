// 模拟用户跑全部流程，找 bug
const { JSDOM, ResourceLoader } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// 自定义 loader 跳过外部资源
class NoFetchLoader extends ResourceLoader {
  fetch(url) { return Promise.resolve(Buffer.from('')); }
}

const errors = [];
const warnings = [];
const logs = [];

const dom = new JSDOM(html, {
  url: 'http://127.0.0.1:18800/',
  runScripts: 'dangerously',
  resources: new NoFetchLoader(),
  pretendToBeVisual: true,
  virtualConsole: new (require('jsdom').VirtualConsole)()
    .on('error', e => errors.push('[err] ' + e.message))
    .on('warn', e => warnings.push('[warn] ' + e.message))
    .on('jsdomError', e => errors.push('[jsdom] ' + e.message))
    .on('log', e => logs.push('[log] ' + e))
});

// 注入 moblie userAgent + 移动 viewport
Object.defineProperty(dom.window.navigator, 'userAgent', { value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15' });

// 等待脚本执行
setTimeout(() => {
  const win = dom.window;
  const doc = win.document;
  
  console.log('=== 基础检查 ===');
  console.log('DRUG_GUIDE 条数:', Object.keys(win.DRUG_GUIDE || {}).length);
  console.log('DRUG_SYNONYMS 条数:', Object.keys(win.DRUG_SYNONYMS || {}).length);
  console.log('fuzzyMatchDrug:', typeof win.fuzzyMatchDrug);
  console.log('findDrugManual:', typeof win.findDrugManual);
  console.log('doSearch:', typeof win.doSearch);
  console.log('searchBySymptom:', typeof win.searchBySymptom);
  console.log('searchBySymptomData:', typeof win.searchBySymptomData);
  console.log('callAI:', typeof win.callAI);
  console.log('callGroqAPI:', typeof win.callGroqAPI);
  console.log('openDrugCamera:', typeof win.openDrugCamera);
  console.log('openManualInput:', typeof win.openManualInput);
  console.log('switchTab:', typeof win.switchTab);
  console.log('showNetwork:', typeof win.showNetwork);
  console.log('formatText:', typeof win.formatText);
  
  // 检查关键 DOM 元素
  console.log('\n=== 关键 DOM ===');
  ['tab-home','tab-interact','tab-chat','tab-report','tab-cabinet','tab-member','tab-reminder',
   'searchInput','searchBtn','searchResult','symptomInput','symptomResults',
   'chatInput','chatSendBtn','chatMessages','ocrResult',
   'drugInput1','drugInput2','interactBtn','interactResult',
   'reportSymptoms','reportTongue','reportPulse','reportGenerateBtn','reportResult',
   'cabName','cabDose','cabExpiry','cabAddBtn','cabinetList',
   'memberName','memberAge','memberAddBtn','memberList',
   'reminderDrug','reminderTime','reminderAddBtn','reminderList'
  ].forEach(id => {
    const el = doc.getElementById(id);
    console.log('  ' + (el ? 'OK' : 'NO') + ' #' + id);
  });
  
  // 模拟切换 Tab
  console.log('\n=== 模拟切换 Tab ===');
  ['home','interact','chat','report','cabinet','member','reminder'].forEach(tab => {
    try {
      win.switchTab(tab);
      const el = doc.getElementById('tab-' + tab);
      console.log('  ' + (el && el.classList.contains('active') ? 'OK' : 'NO') + ' switchTab(' + tab + ')');
    } catch (e) {
      console.log('  ERR switchTab(' + tab + '): ' + e.message);
    }
  });
  
  // 模拟用户输入测试
  console.log('\n=== 智能搜索测试 ===');
  try {
    doc.getElementById('searchInput').value = '我的脚疼';
    win.doSearch();
    setTimeout(() => {
      const r = doc.getElementById('searchResult');
      console.log('  「我的脚疼」结果长度:', r.innerHTML.length);
      console.log('  前 200 字:', r.innerHTML.slice(0, 200).replace(/<[^>]+>/g, ' ').slice(0, 200));
      
      // 测药库精确
      doc.getElementById('searchInput').value = '布洛芬';
      win.doSearch();
      setTimeout(() => {
        console.log('  「布洛芬」结果长度:', r.innerHTML.length);
        console.log('  包含 适应症:', r.innerHTML.includes('适应症'));
        
        // 测症状搜药
        console.log('\n=== 症状搜药测试 ===');
        doc.getElementById('symptomInput').value = '脚疼';
        try { win.searchBySymptom(); } catch(e) { console.log('  ERR: ' + e.message); }
        setTimeout(() => {
          const sr = doc.getElementById('symptomResults');
          console.log('  「脚疼」结果长度:', sr.innerHTML.length);
          console.log('  包含 布洛芬:', sr.innerHTML.includes('布洛芬'));
          console.log('  包含 阿司匹林:', sr.innerHTML.includes('阿司匹林'));
          
          // 测相互作用
          console.log('\n=== 相互作用测试 ===');
          try {
            doc.getElementById('drugInput1').value = '布洛芬';
            doc.getElementById('drugInput2').value = '阿司匹林';
            win.showNetwork('布洛芬'); // 默认 showNetwork 用 布洛芬
            setTimeout(() => {
              const ir = doc.getElementById('interactResult') || doc.body;
              console.log('  相互作用渲染长度:', ir.innerHTML.length);
              console.log('  包含 节点:', ir.innerHTML.includes('布洛芬'));
              
              // 测 chat
              console.log('\n=== Chat 测试 ===');
              win.switchTab('chat');
              doc.getElementById('chatInput').value = '999感冒灵';
              try {
                const ev = new dom.window.Event('keydown', {key: 'Enter'});
                doc.getElementById('chatInput').dispatchEvent(ev);
              } catch(e) { console.log('  Enter ERR: ' + e.message); }
              
              setTimeout(() => {
                console.log('  chat messages 长度:', doc.getElementById('chatMessages').innerHTML.length);
                console.log('  包含 999感冒灵:', doc.getElementById('chatMessages').innerHTML.includes('999感冒灵'));
                
                // 测辨证报告生成
                console.log('\n=== 辨证报告测试 ===');
                win.switchTab('report');
                doc.getElementById('reportSymptoms').value = '口干,心烦,失眠';
                doc.getElementById('reportTongue').value = '红舌';
                doc.getElementById('reportPulse').value = '数脉';
                try {
                  const btn = doc.getElementById('reportGenerateBtn');
                  btn.click();
                } catch(e) { console.log('  ERR click: ' + e.message); }
                setTimeout(() => {
                  const rr = doc.getElementById('reportResult');
                  console.log('  报告结果长度:', rr.innerHTML.length);
                  console.log('  报告前 300 字:', rr.innerHTML.slice(0, 300).replace(/<[^>]+>/g, ' ').slice(0, 300));
                  
                  // 测拍照/手动输入
                  console.log('\n=== 拍照/手动输入 ===');
                  console.log('  openDrugCamera 存在:', typeof win.openDrugCamera);
                  console.log('  openManualInput 存在:', typeof win.openManualInput);
                  
                  // 测药箱
                  console.log('\n=== 药箱测试 ===');
                  win.switchTab('cabinet');
                  console.log('  药箱 Tab active:', doc.getElementById('tab-cabinet').classList.contains('active'));
                  
                  // 测家庭
                  console.log('\n=== 家庭测试 ===');
                  try { win.switchTab('member'); console.log('  家庭 Tab active:', doc.getElementById('tab-member').classList.contains('active')); } catch(e){ console.log('  ERR: ' + e.message); }
                  
                  // 测提醒
                  console.log('\n=== 提醒测试 ===');
                  try { win.switchTab('reminder'); console.log('  提醒 Tab active:', doc.getElementById('tab-reminder').classList.contains('active')); } catch(e){ console.log('  ERR: ' + e.message); }
                  
                  // 抓所有错
                  console.log('\n=== 捕获的错误 ===');
                  if (errors.length === 0) console.log('  无错误 ✅');
                  else errors.slice(0, 20).forEach(e => console.log('  ' + e));
                  
                  if (warnings.length) warnings.slice(0, 5).forEach(e => console.log('  W: ' + e));
                  
                  process.exit(0);
                }, 500);
              }, 500);
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  } catch (e) {
    console.log('ERR 智能搜索: ' + e.message);
    process.exit(1);
  }
}, 2000);
