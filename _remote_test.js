const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const BASE = 'http://132.232.141.186:9033';

  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 7000)); // wait for splash

  // === 测试药物相互作用 (用 evaluate 调用 switchTab) ===
  console.log('=== 药物相互作用 ===');
  await page.evaluate(() => { if(typeof switchTab==='function') switchTab('interact'); });
  await new Promise(r => setTimeout(r, 800));

  // 输入药物
  const drugInput1 = await page.$('#drugInput1');
  if (drugInput1) {
    await drugInput1.type('布洛芬');
    await page.type('#drugInput2', '阿司匹林');
    await page.click('#interactBtn', { timeout: 5000 }).catch(e => console.log('click error:', e.message));
    await new Promise(r => setTimeout(r, 2000));
    const interactNet = await page.evaluate(() => {
      const el = document.getElementById('interactNet');
      return el ? { text: el.textContent.trim().slice(0, 300), len: el.textContent.length } : { text: 'NOT FOUND', len: 0 };
    });
    console.log('布洛芬+阿司匹林:', JSON.stringify(interactNet));
  } else {
    console.log('⚠️ drugInput1 不存在，切换到 interact 后检查页面内容');
    const pageContent = await page.evaluate(() => {
      const body = document.body.textContent.slice(0, 500);
      const tabs = [...document.querySelectorAll('[data-tab]')].map(e => e.textContent.trim());
      return { body, tabs };
    });
    console.log('页面内容:', JSON.stringify(pageContent));
  }

  // === 测试 EN 翻译 ===
  console.log('\n=== EN 翻译 (Profile) ===');
  await page.evaluate(() => {
    localStorage.setItem('lang', 'en');
    if(typeof switchTab==='function') switchTab('profile');
  });
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 7000));
  await page.evaluate(() => { if(typeof switchTab==='function') switchTab('profile'); });
  await new Promise(r => setTimeout(r, 1000));
  const profile = await page.evaluate(() => ({
    profileTitle: document.getElementById('profileTitle')?.textContent,
    profileEditBtn: document.getElementById('profileEditBtn')?.textContent,
    profileLogoutBtn: document.getElementById('profileLogoutBtn')?.textContent,
    navProfile: document.getElementById('navProfile')?.textContent,
  }));
  console.log('Profile (EN):', JSON.stringify(profile));

  await page.screenshot({ path: 'shot_remote_final.png', fullPage: false });
  console.log('\n✅ shot_remote_final.png');
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
