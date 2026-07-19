const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6500));

  // === 测试药物相互作用 (先切换到 interact Tab) ===
  console.log('=== 药物相互作用 ===');
  await page.click('[data-tab="interact"]');
  await new Promise(r => setTimeout(r, 500));
  const drugInput1 = await page.$('#drugInput1');
  if (drugInput1) {
    await drugInput1.type('布洛芬');
    await page.type('#drugInput2', '阿司匹林');
    await page.click('#interactBtn');
    await new Promise(r => setTimeout(r, 1500));
    const interactNet = await page.evaluate(() => {
      const el = document.getElementById('interactNet');
      return el ? { text: el.textContent.trim().slice(0, 300), len: el.textContent.length } : { text: 'NOT FOUND', len: 0 };
    });
    console.log('布洛芬+阿司匹林:', JSON.stringify(interactNet));
  }

  // === 测试症状搜药 ===
  console.log('\n=== 症状搜药 ===');
  await page.click('[data-tab="home"]');
  await new Promise(r => setTimeout(r, 500));
  const symptomInput = await page.$('#homeSymptomInput');
  if (symptomInput) {
    await symptomInput.type('脚疼');
    await page.click('#homeSymptomBtn');
    await new Promise(r => setTimeout(r, 1500));
    const results = await page.evaluate(() => {
      const el = document.getElementById('symptomResults');
      return el ? { text: el.textContent.trim().slice(0, 200), len: el.textContent.length } : { text: 'NOT FOUND', len: 0 };
    });
    console.log('脚疼搜药:', JSON.stringify(results));
  }

  // === 测试 EN 翻译 ===
  console.log('\n=== EN 翻译 (Profile) ===');
  await page.evaluate(() => localStorage.setItem('lang', 'en'));
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6500));
  await page.click('[data-tab="profile"]');
  await new Promise(r => setTimeout(r, 1000));
  const profile = await page.evaluate(() => ({
    profileTitle: document.getElementById('profileTitle')?.textContent,
    profileEditBtn: document.getElementById('profileEditBtn')?.textContent,
    profileLogoutBtn: document.getElementById('profileLogoutBtn')?.textContent,
    navProfile: document.getElementById('navProfile')?.textContent,
  }));
  console.log('Profile (EN):', JSON.stringify(profile));

  await page.screenshot({ path: 'shot_final.png', fullPage: false });
  console.log('\n✅ shot_final.png');
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
