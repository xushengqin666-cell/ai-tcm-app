const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('[pageerror] ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('[err] ' + m.text()); });
  await page.goto('http://127.0.0.1:18800/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  const diag = await page.evaluate(() => {
    const out = {};
    // 1) 直接调 TCMEngine
    try {
      const a = window.TCMEngine.comprehensiveAnalysis('口干,心烦,失眠', '红舌少苔', '细数');
      out.analysis = { pattern: a.pattern, baGang: a.baGang, reasonLen: (a.reason||[]).length };
      const p = window.TCMEngine.generateTreatmentPlan(a);
      out.plan = { treatment: p.treatment, herbs: p.herbs.length, diet: p.diet.length, acu: p.acupoints.length };
    } catch (e) { out.analysisErr = e.message; }

    // 2) 走报告生成按钮
    try {
      window.switchTab('report');
      const s = document.getElementById('reportSymptoms');
      const t = document.getElementById('reportTongue');
      const pl = document.getElementById('reportPulse');
      const btn = document.getElementById('reportGenerateBtn');
      out.ids = { s: !!s, t: !!t, pl: !!pl, btn: !!btn };
      if (s) s.value = '口干,心烦,失眠';
      if (t) t.value = '红舌少苔';
      if (pl) pl.value = '细数';
      if (btn) btn.click();
    } catch (e) { out.clickErr = e.message; }
    return out;
  });
  await new Promise(r => setTimeout(r, 1500));
  const result = await page.evaluate(() => {
    const el = document.getElementById('reportResult');
    return { len: el ? el.innerHTML.length : -1, hasContent: el ? el.innerHTML.includes('辨证结果') : false, snippet: el ? el.innerHTML.slice(0, 200) : '' };
  });
  console.log('DIAG:', JSON.stringify(diag, null, 2));
  console.log('RESULT:', JSON.stringify(result, null, 2));
  console.log('ERRORS:', errs.length ? errs.join('\n') : 'none');
  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
