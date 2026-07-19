const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  const logs = [];
  page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));

  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.evaluate(() => {
    localStorage.removeItem('cy_session');
    localStorage.setItem('lang', 'en');
  });
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6000));

  // 强制调用 window.applyLang
  const forceResult = await page.evaluate(() => {
    try {
      if (typeof window.applyLang === 'function') {
        window.applyLang('en');
        return 'applyLang called successfully';
      } else {
        return 'applyLang NOT a function: ' + typeof window.applyLang;
      }
    } catch(e) {
      return 'error: ' + e.message;
    }
  });
  console.log('force call:', forceResult);

  const result = await page.evaluate(() => ({
    authTitle: document.getElementById('authTitle')?.textContent,
    authTabLogin: document.getElementById('authTabLogin')?.textContent,
    authPhonePh: document.getElementById('authPhonePh')?.placeholder,
    authSubmitBtn: document.getElementById('authSubmitBtn')?.textContent,
    windowCurrentLang: window.currentLang,
    localStorageLang: localStorage.getItem('lang'),
    windowApplyLang: typeof window.applyLang,
  }));
  console.log('结果:', JSON.stringify(result, null, 2));
  console.log('日志:', logs.slice(-10).join('\n'));

  await page.screenshot({ path: 'shot_auth_force.png', fullPage: false });
  console.log('✅ shot_auth_force.png');
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
