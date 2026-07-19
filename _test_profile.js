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

  // 截图首页
  await page.screenshot({ path: 'shot_home_en2.png', fullPage: false });
  console.log('✅ shot_home_en2.png');

  // 检查翻译
  const result = await page.evaluate(() => {
    return {
      // 症状输入框
      reportSymptomLabel: document.getElementById('reportSymptomLabel')?.textContent,
      reportSymptomInput: document.getElementById('reportSymptomInput')?.placeholder,
      // 底部导航
      navProfile: document.getElementById('navProfile')?.textContent,
      // 我的页面
      profileTitle: document.getElementById('profileTitle')?.textContent,
    };
  });
  console.log('EN 翻译检查:', JSON.stringify(result, null, 2));

  // 点击"我的"Tab
  await page.click('[data-tab="profile"]');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'shot_profile_en.png', fullPage: false });
  console.log('✅ shot_profile_en.png');

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
