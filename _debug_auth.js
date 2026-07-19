const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  // 直接 inject 脚本：在 applyLang 之前拦截 lang 设置
  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 });

  // 立即 inject: 强制 en + 清 session + 直接调 applyLang
  await page.evaluate(() => {
    localStorage.setItem('lang', 'en');
    localStorage.removeItem('cy_session');
    // 调用 applyLang
    if (typeof applyLang === 'function') {
      applyLang('en');
      console.log('applyLang called, authTitle =', document.getElementById('authTitle')?.textContent);
    } else {
      console.log('applyLang NOT found!');
    }
    // 直接设置文本（绕过 applyLang）
    const el = document.getElementById('authTitle');
    if (el) el.textContent = 'Caiyun Smart Pharmacy';
    const sub = document.getElementById('authSub');
    if (sub) sub.textContent = 'Family AI Pharmacist';
    console.log('direct set, authTitle =', document.getElementById('authTitle')?.textContent);
  });

  // 等 splash 动画（2.5s）+ 一点点缓冲
  await new Promise(r => setTimeout(r, 5000));

  const result = await page.evaluate(() => {
    return {
      authTitle: document.getElementById('authTitle')?.textContent,
      authSub: document.getElementById('authSub')?.textContent,
      authTabLogin: document.getElementById('authTabLogin')?.textContent,
      authPhonePh: document.getElementById('authPhonePh')?.placeholder,
      authSubmitBtn: document.getElementById('authSubmitBtn')?.textContent,
      authSkipBtn: document.getElementById('authSkipBtn')?.textContent,
      langToggleExists: !!document.getElementById('langToggle'),
      currentLang: window.currentLang,
      jsErrors: window.__jsErrors || [],
    };
  });
  console.log('Result:', JSON.stringify(result, null, 2));

  await page.screenshot({ path: 'shot_auth_debug.png', fullPage: false });
  console.log('✅ shot_auth_debug.png');
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
