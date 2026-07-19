const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  // 拦截 console 输出
  const logs = [];
  page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));

  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.evaluate(() => {
    localStorage.removeItem('cy_session');
    localStorage.setItem('lang', 'en');
  });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });

  // 等 splash + auth 显示（auth 在 splash 后约 2.5s）
  await new Promise(r => setTimeout(r, 6000));

  const result = await page.evaluate(() => {
    return {
      authTitle: document.getElementById('authTitle')?.textContent,
      authTabLogin: document.getElementById('authTabLogin')?.textContent,
      authPhonePh: document.getElementById('authPhonePh')?.placeholder,
      authSubmitBtn: document.getElementById('authSubmitBtn')?.textContent,
      currentLang: window.currentLang,
      localStorageLang: localStorage.getItem('lang'),
      authGateVisible: document.getElementById('authGate')?.classList.contains('show'),
    };
  });
  console.log('DOM 状态:', JSON.stringify(result, null, 2));
  console.log('\nconsole logs (最后20条):');
  logs.slice(-20).forEach(l => console.log(l));

  await page.screenshot({ path: 'shot_auth_debug2.png', fullPage: false });
  console.log('✅ shot_auth_debug2.png');
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
