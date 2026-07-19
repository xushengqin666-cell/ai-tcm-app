const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  // 先清 session，第一次加载就设 lang=en（这样 applyLang('en') 一开始就跑）
  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  // splash 之前立刻注入 lang=en + 清 cy_session
  await page.evaluate(() => {
    localStorage.removeItem('cy_users');
    localStorage.removeItem('cy_session');
    localStorage.setItem('lang', 'en');
  });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
  // 等 splash 完成 + auth 弹窗显示（authGate 在 splash 后显示）
  await new Promise(r => setTimeout(r, 5500));

  const authTexts = await page.evaluate(() => {
    return {
      title: (document.getElementById('authTitle')||{}).textContent||'NULL',
      sub: (document.getElementById('authSub')||{}).textContent||'NULL',
      tabLogin: (document.getElementById('authTabLogin')||{}).textContent||'NULL',
      tabReg: (document.getElementById('authTabRegister')||{}).textContent||'NULL',
      phonePh: (document.getElementById('authPhonePh')||{}).placeholder||'NULL',
      pwdPh: (document.getElementById('authPwdPh')||{}).placeholder||'NULL',
      submitBtn: (document.getElementById('authSubmitBtn')||{}).textContent||'NULL',
      skipBtn: (document.getElementById('authSkipBtn')||{}).textContent||'NULL',
    };
  });
  console.log('auth EN texts:', JSON.stringify(authTexts, null, 2));

  await page.screenshot({ path: 'shot_auth_en.png', fullPage: false });
  console.log('✅ shot_auth_en.png');
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
