const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  // 设置 EN 语言
  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.evaluate(() => { localStorage.setItem('lang', 'en'); });
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6000));

  // 点击"我的"Tab
  await page.click('[data-tab="profile"]');
  await new Promise(r => setTimeout(r, 2000));

  // 检查所有 profile 元素翻译
  const result = await page.evaluate(() => {
    return {
      profileTitle: document.getElementById('profileTitle')?.textContent,
      profileEditBtn: document.getElementById('profileEditBtn')?.textContent,
      profileSettingsBtn: document.getElementById('profileSettingsBtn')?.textContent,
      profileAboutBtn: document.getElementById('profileAboutBtn')?.textContent,
      profileLogoutBtn: document.getElementById('profileLogoutBtn')?.textContent,
    };
  });
  console.log('Profile EN 翻译:', JSON.stringify(result, null, 2));

  // 截图 profile 页
  await page.screenshot({ path: 'shot_profile_en2.png', fullPage: false });
  console.log('✅ shot_profile_en2.png');

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
