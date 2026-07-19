const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=390,844',  // iPhone 14 尺寸
      '--disable-dev-shm-usage'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });

  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push('[console.error] ' + m.text()); });
  page.on('pageerror', e => errs.push('[pageerror] ' + e.message));
  page.on('requestfailed', r => errs.push('[reqfail] ' + r.url() + ' ' + (r.failure() && r.failure().errorText)));

  console.log('=== 打开页面 ===');
  await page.goto('http://127.0.0.1:18800/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));  // 等 splash + 初始化

  const report = async (label, fn) => {
    try { const v = await fn(); console.log('  ' + (v ? 'OK' : 'NO') + ' ' + label + (typeof v === 'string' ? ': ' + v.slice(0, 80) : '')); return v; }
    catch (e) { console.log('  ERR ' + label + ': ' + e.message); return null; }
  };

  console.log('\n=== 基础检查 ===');
  await report('DRUG_GUIDE 条数', async () => String(await page.evaluate(() => Object.keys(window.DRUG_GUIDE || {}).length)));
  await report('TCMEngine 存在', async () => await page.evaluate(() => typeof window.TCMEngine !== 'undefined' ? 'yes' : 'no'));
  await report('tcmengine.js 加载无404', async () => !(await page.evaluate(() => !document.querySelector('script[src="tcmengine.js"]'))) ? 'ref-exists' : 'no-ref');
  await report('splash 已消失', async () => !(await page.$('.splash-screen')) ? 'yes' : 'no');

  console.log('\n=== 顶栏搜索 ===');
  await report('输入"我的脚疼"', async () => { await page.type('#searchInput', '我的脚疼'); await page.click('#searchBtn'); return 'typed'; });
  await new Promise(r => setTimeout(r, 1500));
  await report('搜索结果非空(口语)', async () => {
    const len = await page.evaluate(() => document.getElementById('searchResult').innerHTML.length);
    return len > 50 ? ('len=' + len) : 'EMPTY';
  });
  await report('口语结果含布洛芬', async () => await page.evaluate(() => document.getElementById('searchResult').innerHTML.includes('布洛芬')) ? 'yes' : 'no');
  await page.evaluate(() => { document.getElementById('searchInput').value=''; document.getElementById('searchResult').innerHTML=''; });

  console.log('\n=== 精确药名搜索 ===');
  await report('输入"布洛芬"', async () => { await page.type('#searchInput', '布洛芬'); await page.click('#searchBtn'); return 'typed'; });
  await new Promise(r => setTimeout(r, 1000));
  await report('含适应症', async () => await page.evaluate(() => document.getElementById('searchResult').innerHTML.includes('适应症')) ? 'yes' : 'no');
  await page.evaluate(() => { document.getElementById('searchInput').value=''; document.getElementById('searchResult').innerHTML=''; });

  console.log('\n=== Tab 切换 ===');
  for (const t of ['interact','chat','report','cabinet','member','reminder','home']) {
    await report('switchTab(' + t + ')', async () => {
      await page.evaluate((tab) => window.switchTab(tab), t);
      await new Promise(r => setTimeout(r, 300));
      return await page.evaluate((tab) => document.getElementById('tab-' + tab).classList.contains('active'), t) ? 'active' : 'NOT active';
    });
  }

  console.log('\n=== 症状搜药 ===');
  await report('切到 home 并输入脚疼', async () => {
    await page.evaluate(() => window.switchTab('home'));
    await new Promise(r => setTimeout(r, 300));
    await page.type('#symptomInput', '脚疼');
    await page.click('#symptomSearchBtn');  // 可能的按钮 id
    return 'done';
  });
  // 尝试多种按钮
  await page.evaluate(() => {
    const b = document.querySelector('#symptomResults ~ button, button[onclick*="searchBySymptom"], #symptomSearchBtn');
    if (b) b.click();
    else if (typeof window.searchBySymptom === 'function') window.searchBySymptom();
  });
  await new Promise(r => setTimeout(r, 1000));
  await report('症状结果含布洛芬', async () => await page.evaluate(() => {
    const el = document.getElementById('symptomResults');
    return el && el.innerHTML.includes('布洛芬');
  }) ? 'yes' : 'no');

  console.log('\n=== 相互作用 ===');
  await report('布洛芬+阿司匹林', async () => {
    await page.evaluate(() => window.switchTab('interact'));
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => {
      const a = document.getElementById('drugInput1');
      const b = document.getElementById('drugInput2');
      const btn = document.getElementById('interactBtn');
      if (a && b && btn) { a.value = '布洛芬'; b.value = '阿司匹林'; btn.click(); }
    });
    await new Promise(r => setTimeout(r, 1500));
    return 'clicked';
  });
  await report('相互作用有渲染', async () => await page.evaluate(() => {
    const candidates = ['interactResult','interactNet','interactDetail','netDetailCard'];
    for (const id of candidates) {
      const el = document.getElementById(id);
      if (el && el.innerHTML.trim().length > 50) return id + ' len=' + el.innerHTML.length;
    }
    return 'NONE';
  }));

  console.log('\n=== Chat ===');
  await report('切 chat 发消息', async () => {
    await page.evaluate(() => window.switchTab('chat'));
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => { document.getElementById('chatInput').value = '布洛芬能空腹吃吗'; window.sendChat(); });
    return 'sent';
  });
  await new Promise(r => setTimeout(r, 8000));
  await report('chat 有回复(非EMPTY)', async () => await page.evaluate(() => {
    const el = document.getElementById('chatMessages');
    const txt = el ? el.innerText : '';
    return (txt && txt.length > 30) ? ('len=' + txt.length) : 'EMPTY';
  }));

  console.log('\n=== 辨证报告 ===');
  await report('生成报告', async () => {
    await page.evaluate(() => window.switchTab('report'));
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => {
      const s = document.getElementById('reportSymptoms');
      const btn = document.getElementById('reportGenerateBtn');
      if (s && btn) { s.value = '口干,心烦,失眠'; btn.click(); }
    });
    await new Promise(r => setTimeout(r, 1500));
    return 'clicked';
  });
  await report('报告有内容', async () => await page.evaluate(() => {
    const el = document.getElementById('reportResult');
    return el && el.innerHTML.length > 50 ? ('len=' + el.innerHTML.length) : 'EMPTY';
  }));

  console.log('\n=== 拍照/手动输入 ===');
  await report('手动输入按钮存在', async () => await page.evaluate(() => !!document.querySelector('button[onclick*="openManualInput"]')) ? 'yes' : 'no');
  await report('拍照按钮存在', async () => await page.evaluate(() => !!document.getElementById('drugCameraBtn')) ? 'yes' : 'no');

  console.log('\n=== 错误汇总 ===');
  if (!errs.length) console.log('  无 JS 错误 ✅');
  else errs.slice(0, 25).forEach(e => console.log('  ' + e));

  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
