// 简化版：跑所有用户流程，找 bug
const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const errors = [];
const vc = new VirtualConsole();
vc.on('error', e => errors.push('[err] ' + e.message));
vc.on('jsdomError', e => errors.push('[jsdom] ' + (e.message || e)));
vc.on('warn', e => errors.push('[warn] ' + e));

const dom = new JSDOM(html, {
  url: 'http://127.0.0.1:18800/',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  virtualConsole: vc
});

function safe(fn) { try { fn(); } catch(e) { errors.push('[safe] ' + e.message); } }

setTimeout(() => {
  const win = dom.window, doc = win.document;
  const has = (n) => typeof win[n] === 'function';
  const id = (n) => doc.getElementById(n);
  
  console.log('=== 1. 基础检查 ===');
  console.log('DRUG_GUIDE:', Object.keys(win.DRUG_GUIDE || {}).length);
  console.log('DRUG_SYNONYMS:', Object.keys(win.DRUG_SYNONYMS || {}).length);
  console.log('fuzzyMatchDrug:', has('fuzzyMatchDrug'));
  console.log('findDrugManual:', has('findDrugManual'));
  console.log('doSearch:', has('doSearch'));
  console.log('searchBySymptom:', has('searchBySymptom'));
  console.log('searchBySymptomData:', has('searchBySymptomData'));
  console.log('openDrugCamera:', has('openDrugCamera'));
  console.log('openManualInput:', has('openManualInput'));
  console.log('switchTab:', has('switchTab'));
  console.log('formatText:', has('formatText'));
  console.log('showNetwork:', has('showNetwork'));
  
  console.log('\n=== 2. Tab 切换 ===');
  ['home','interact','chat','report','cabinet','member','reminder'].forEach(t => {
    safe(() => {
      win.switchTab(t);
      const el = id('tab-' + t);
      const ok = el && el.classList.contains('active');
      console.log('  ' + (ok ? 'OK' : 'NO') + ' ' + t);
    });
  });
  
  console.log('\n=== 3. 顶栏搜索 ===');
  safe(() => {
    id('searchInput').value = '我的脚疼';
    win.doSearch();
  });
  setTimeout(() => {
    const r = id('searchResult');
    console.log('  长度:', r.innerHTML.length);
    console.log('  含 布洛芬:', r.innerHTML.includes('布洛芬'));
    console.log('  含 关节:', r.innerHTML.includes('关节'));
    
    console.log('\n=== 4. 药库精确 ===');
    safe(() => { id('searchInput').value = '布洛芬'; win.doSearch(); });
    setTimeout(() => {
      console.log('  长度:', r.innerHTML.length);
      console.log('  含 适应症:', r.innerHTML.includes('适应症'));
      console.log('  含 解热:', r.innerHTML.includes('解热'));
      
      console.log('\n=== 5. 症状搜药 ===');
      safe(() => { id('symptomInput').value = '脚疼'; win.searchBySymptom(); });
      setTimeout(() => {
        const sr = id('symptomResults');
        console.log('  长度:', sr.innerHTML.length);
        console.log('  含 布洛芬:', sr.innerHTML.includes('布洛芬'));
        console.log('  含 匹配:', sr.innerHTML.includes('匹配'));
        
        console.log('\n=== 6. 相互作用 ===');
        safe(() => {
          id('drugInput1').value = '布洛芬';
          id('drugInput2').value = '阿司匹林';
          win.showInteract && win.showInteract();
        });
        setTimeout(() => {
          const ir = id('interactResult');
          if (ir) {
            console.log('  interactResult 长度:', ir.innerHTML.length);
          } else {
            console.log('  interactResult 不存在');
            console.log('  body 长度:', doc.body.innerHTML.length);
          }
          
          console.log('\n=== 7. Chat 输入 ===');
          safe(() => {
            win.switchTab('chat');
            id('chatInput').value = '999感冒灵';
            const btn = id('chatSendBtn');
            if (btn) btn.click();
            else console.log('  无 chatSendBtn');
          });
          setTimeout(() => {
            const cm = id('chatMessages');
            console.log('  chatMessages 长度:', cm.innerHTML.length);
            console.log('  含 999感冒灵:', cm.innerHTML.includes('999感冒灵'));
            
            console.log('\n=== 8. 辨证报告 ===');
            safe(() => {
              win.switchTab('report');
              id('reportSymptoms').value = '口干,心烦,失眠';
              id('reportTongue').value = '红舌';
              id('reportPulse').value = '数脉';
              const btn = id('reportGenerateBtn');
              if (btn) btn.click();
              else console.log('  无 reportGenerateBtn');
            });
            setTimeout(() => {
              const rr = id('reportResult');
              if (rr) {
                console.log('  报告长度:', rr.innerHTML.length);
                console.log('  前 200:', rr.innerHTML.slice(0,200).replace(/<[^>]+>/g,' ').slice(0,200));
              }
              
              console.log('\n=== 9. 手动输入 ===');
              safe(() => {
                win.openManualInput && win.openManualInput();
              });
              
              console.log('\n=== 10. 拍照按钮 ===');
              console.log('  drugCameraBtn 存在:', !!id('drugCameraBtn'));
              console.log('  手动输入按钮存在:', !!doc.querySelector('button[onclick*="openManualInput"]'));
              
              console.log('\n=== 错误汇总 ===');
              if (errors.length === 0) console.log('  无错误 ✅');
              else errors.slice(0, 30).forEach(e => console.log('  ' + e));
              
              process.exit(0);
            }, 800);
          }, 800);
        }, 500);
      }, 500);
    }, 500);
  }, 500);
}, 2000);
