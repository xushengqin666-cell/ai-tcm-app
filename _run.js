const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const http = require('http');

const PORT = 18800;
const URL = 'http://127.0.0.1:' + PORT + '/';

function waitServer(timeoutMs) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    (function poll() {
      const req = http.get(URL, res => { res.resume(); resolve(true); });
      req.on('error', () => {
        if (Date.now() - t0 > timeoutMs) reject(new Error('server timeout'));
        else setTimeout(poll, 300);
      });
    })();
  });
}

(async () => {
  // 1) 起服务器（与测试同进程，避免被杀）
  const srv = spawn('node', ['_serve.js'], { cwd: __dirname, stdio: 'ignore' });

  try {
    await waitServer(10000);
  } catch (e) {
    console.log('❌ 服务器启动失败:', e.message);
    srv.kill(); process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  const errs = [];
  page.on('pageerror', e => errs.push('[pageerror] ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('[err] ' + m.text()); });

  const report = async (label, fn) => {
    try { const v = await fn(); console.log('  ' + (v ? 'OK ' : 'NO ') + label + ' -> ' + v); return v; }
    catch (e) { console.log('  ERR ' + label + ': ' + e.message); return null; }
  };

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2800));

  console.log('\n=== 基础 ===');
  await report('DRUG_GUIDE 条数', async () => String(await page.evaluate(() => Object.keys(window.DRUG_GUIDE || {}).length)));
  await report('TCMEngine 存在', async () => await page.evaluate(() => typeof window.TCMEngine !== 'undefined' ? 'yes' : 'no'));
  await report('splash 已消失', async () => !(await page.$('.splash-screen')) ? 'yes' : 'no');

  console.log('\n=== 顶栏口语搜索 ===');
  await report('输入"我的脚疼"并搜索', async () => { await page.evaluate(() => { document.getElementById('searchInput').value = '我的脚疼'; window.doSearch(); }); return 'done'; });
  await new Promise(r => setTimeout(r, 1200));
  await report('结果非空(口语)', async () => { const len = await page.evaluate(() => document.getElementById('searchResult').innerHTML.length); return len > 50 ? ('len=' + len) : 'EMPTY'; });
  await report('含布洛芬', async () => await page.evaluate(() => document.getElementById('searchResult').innerHTML.includes('布洛芬')) ? 'yes' : 'no');
  await page.evaluate(() => { document.getElementById('searchInput').value=''; document.getElementById('searchResult').innerHTML=''; });

  console.log('\n=== 精确药名搜索 ===');
  await report('输入"布洛芬"', async () => { await page.evaluate(() => { document.getElementById('searchInput').value = '布洛芬'; window.doSearch(); }); return 'done'; });
  await new Promise(r => setTimeout(r, 1000));
  await report('含适应症', async () => await page.evaluate(() => document.getElementById('searchResult').innerHTML.includes('适应症')) ? 'yes' : 'no');

  console.log('\n=== Tab 切换 ===');
  for (const t of ['interact','chat','report','cabinet','member','reminder','home']) {
    await report('switchTab(' + t + ')', async () => { const ok = await page.evaluate(x => { window.switchTab(x); return document.getElementById('tab-' + x).classList.contains('active'); }, t); return ok ? 'active' : 'NO'; });
  }

  console.log('\n=== 症状搜药(home) ===');
  await report('切 home 搜"脚疼"', async () => { await page.evaluate(() => { window.switchTab('home'); const i = document.getElementById('symptomInput'); if (i) { i.value = '脚疼'; } if (typeof searchBySymptom === 'function') searchBySymptom(); else if (i) { i.dispatchEvent(new Event('input')); } }); return 'done'; });
  await new Promise(r => setTimeout(r, 1000));
  await report('症状结果含布洛芬', async () => await page.evaluate(() => { const el = document.getElementById('symptomResults'); return el && el.innerHTML.includes('布洛芬'); }) ? 'yes' : 'no');

  console.log('\n=== 相互作用 ===');
  await report('布洛芬+阿司匹林', async () => { const ok = await page.evaluate(() => { const a = document.getElementById('drugInput1'), b = document.getElementById('drugInput2'); if (a && b) { a.value = '布洛芬'; b.value = '阿司匹林'; document.getElementById('interactBtn').click(); return true; } return false; }); return ok ? 'clicked' : 'no-inputs'; });
  await new Promise(r => setTimeout(r, 1200));
  await report('相互作用有结果', async () => { const len = await page.evaluate(() => { const el = document.getElementById('interactDetail') || document.getElementById('interactResult'); return el ? el.innerHTML.length : -1; }); return len > 20 ? ('len=' + len) : 'EMPTY'; });

  console.log('\n=== Chat ===');
  await report('切 chat 发消息', async () => { await page.evaluate(() => { window.switchTab('chat'); document.getElementById('chatInput').value = '布洛芬能空腹吃吗'; window.sendChat(); }); return 'sent'; });
  await new Promise(r => setTimeout(r, 8000));
  await report('chat 有回复(非EMPTY)', async () => await page.evaluate(() => { const el = document.getElementById('chatMessages'); const txt = el ? el.innerText : ''; return (txt && txt.length > 30) ? ('len=' + txt.length) : 'EMPTY'; }));

  console.log('\n=== 辨证报告 ===');
  await report('生成报告', async () => { await page.evaluate(() => { window.switchTab('report'); const s = document.getElementById('reportSymptoms'), t = document.getElementById('reportTongue'), p = document.getElementById('reportPulse'), btn = document.getElementById('reportGenerateBtn'); if (s) s.value = '口干,心烦,失眠'; if (t) t.value = '红舌少苔'; if (p) p.value = '细数'; if (btn) btn.click(); }); return 'clicked'; });
  await new Promise(r => setTimeout(r, 1500));
  await report('报告有内容', async () => { const len = await page.evaluate(() => { const el = document.getElementById('reportResult'); return el ? el.innerHTML.length : -1; }); return len > 50 ? ('len=' + len) : 'EMPTY'; });

  console.log('\n=== 拍照/手动输入 ===');
  await report('openManualInput 可调', async () => await page.evaluate(() => typeof window.openManualInput === 'function') ? 'yes' : 'no');
  await report('拍照按钮存在', async () => await page.evaluate(() => !!document.getElementById('drugCameraBtn')) ? 'yes' : 'no');

  console.log('\n=== 错误汇总 ===');
  console.log(errs.length ? errs.join('\n') : '无 JS 错误 ✅');

  await browser.close();
  srv.kill();
  process.exit(0);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
