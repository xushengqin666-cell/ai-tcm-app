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
  await new Promise(r => setTimeout(r, 6500)); // wait for splash

  console.log('=== 首页检查 ===');
  const home = await page.evaluate(() => ({
    homeTitle: document.getElementById('homeTitle')?.textContent,
    featInteract: document.getElementById('featInteract')?.textContent,
    featSymptom: document.getElementById('featSymptom')?.textContent,
    navProfile: document.getElementById('navProfile')?.textContent,
  }));
  console.log('首页:', JSON.stringify(home));

  // 测试症状搜药
  console.log('\n=== 症状搜药 ===');
  const symptomInput = await page.$('#homeSymptomInput');
  if (symptomInput) {
    await symptomInput.type('脚疼');
    await page.click('#homeSymptomBtn');
    await new Promise(r => setTimeout(r, 1500));
    const results = await page.evaluate(() => {
      const el = document.getElementById('symptomResults');
      return el ? { text: el.textContent.slice(0, 200), found: el.textContent.length > 10 } : { text: 'NOT FOUND', found: false };
    });
    console.log('脚疼搜药:', results);
  } else {
    console.log('⚠️ 症状输入框不存在');
  }

  // 测试药物相互作用
  console.log('\n=== 药物相互作用 ===');
  const drugInput1 = await page.$('#drugInput1');
  if (drugInput1) {
    await drugInput1.type('布洛芬');
    await page.type('#drugInput2', '阿司匹林');
    await page.click('#interactBtn');
    await new Promise(r => setTimeout(r, 1500));
    const interactNet = await page.evaluate(() => {
      const el = document.getElementById('interactNet');
      return el ? { text: el.textContent.slice(0, 200), found: el.textContent.length > 10 } : { text: 'NOT FOUND', found: false };
    });
    console.log('相互作用结果:', interactNet);
  } else {
    console.log('⚠️ drugInput1 不存在');
  }

  // 测试 Profile 页面 (EN)
  console.log('\n=== Profile 页面 (EN) ===');
  await page.evaluate(() => localStorage.setItem('lang', 'en'));
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6500));
  await page.click('[data-tab="profile"]');
  await new Promise(r => setTimeout(r, 1000));
  const profile = await page.evaluate(() => ({
    profileTitle: document.getElementById('profileTitle')?.textContent,
    profileEditBtn: document.getElementById('profileEditBtn')?.textContent,
    profileLogoutBtn: document.getElementById('profileLogoutBtn')?.textContent,
  }));
  console.log('Profile (EN):', JSON.stringify(profile));

  await page.screenshot({ path: 'shot_verified.png', fullPage: false });
  console.log('\n✅ shot_verified.png');
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
