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
  await page.evaluate(() => { localStorage.setItem('lang', 'en'); localStorage.setItem('cy_session', JSON.stringify({phone:'13800138000',nickname:'Test User'})); });
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6000));

  const checks = {};
  
  // 首页
  checks.home = await page.evaluate(() => ({
    homeTitle: document.getElementById('homeTitle')?.textContent,
    navHome: document.querySelector('[data-tab="home"]')?.textContent?.trim(),
    featSearchDrug: document.getElementById('featSearchDrug')?.textContent,
    featInteract: document.getElementById('featInteract')?.textContent,
    featChat: document.getElementById('featChat')?.textContent,
    featSymptom: document.getElementById('featSymptom')?.textContent,
    navProfile: document.getElementById('navProfile')?.textContent,
  }));
  
  // 跳转到各 Tab
  await page.click('[data-tab="interact"]');
  await new Promise(r => setTimeout(r, 500));
  checks.interact = await page.evaluate(() => ({
    interactTitle: document.getElementById('interactTitle')?.textContent,
    interactDrug1: document.getElementById('interactDrug1')?.placeholder,
    interactDrug2: document.getElementById('interactDrug2')?.placeholder,
    interactBtn: document.getElementById('interactBtn')?.textContent,
  }));

  await page.click('[data-tab="chat"]');
  await new Promise(r => setTimeout(r, 500));
  checks.chat = await page.evaluate(() => ({
    chatTitle: document.getElementById('chatTitle')?.textContent,
    cameraBtn: document.getElementById('cameraBtn')?.textContent,
    chatInput: document.getElementById('chatInput')?.placeholder,
  }));

  await page.click('[data-tab="report"]');
  await new Promise(r => setTimeout(r, 500));
  checks.report = await page.evaluate(() => ({
    reportTitle: document.getElementById('reportTitle')?.textContent,
    reportSymptomLabel: document.getElementById('reportSymptomLabel')?.textContent,
    reportSymptomInput: document.getElementById('reportSymptomInput')?.placeholder,
  }));

  await page.click('[data-tab="profile"]');
  await new Promise(r => setTimeout(r, 500));
  checks.profile = await page.evaluate(() => ({
    profileTitle: document.getElementById('profileTitle')?.textContent,
    profileEditBtn: document.getElementById('profileEditBtn')?.textContent,
    profileSettingsBtn: document.getElementById('profileSettingsBtn')?.textContent,
    profileAboutBtn: document.getElementById('profileAboutBtn')?.textContent,
    profileLogoutBtn: document.getElementById('profileLogoutBtn')?.textContent,
  }));

  await page.screenshot({ path: 'shot_full_en.png', fullPage: false });
  console.log('✅ shot_full_en.png');
  console.log('全量翻译检查:', JSON.stringify(checks, null, 2));

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
