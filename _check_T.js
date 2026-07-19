const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));

  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  const r = await page.evaluate(() => {
    const keys = Object.keys(window).sort();
    return {
      T: typeof window.T,
      T_keys: typeof window.T !== 'undefined' ? Object.keys(window.T.zh || {}).slice(0, 5) : null,
      applyLang: typeof window.applyLang,
      showToast: typeof window.showToast,
      toggleDark: typeof window.toggleDark,
      cyStart: typeof window.__cyStart,
      langRelated: keys.filter(k => k.toLowerCase().includes('lang') || k.toLowerCase().includes('t_') || k.toLowerCase().includes('i18n') || k === 'T' || k === 'currentLang'),
      scriptCount: document.scripts.length,
      bodyLen: document.body.innerHTML.length,
    };
  });
  console.log(JSON.stringify(r, null, 2));
  console.log('\n错误日志:', logs.filter(l => l.startsWith('error')).slice(-5).join('\n'));

  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
