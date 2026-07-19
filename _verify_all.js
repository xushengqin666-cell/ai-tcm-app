const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  // 中文版测试
  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6000)); // wait for splash

  // 测试：症状搜药 "脚疼"
  await page.click('[data-tab="home"]');
  await new Promise(r => setTimeout(r, 500));
  const symptomInput = await page.$('#symptomInput');
  if (symptomInput) {
    await symptomInput.type('脚疼');
    await page.click('#symptomSearchBtn');
    await new Promise(r => setTimeout(r, 1000));
    const results = await page.evaluate(() => {
      const el = document.getElementById('symptomResults');
      return el ? el.textContent.slice(0, 200) : 'NOT FOUND';
    });
    console.log('症状搜药 脚疼 结果:', results);
  } else {
    console.log('⚠️ 症状输入框不存在');
  }

  // 测试：药物相互作用
  await page.click('[data-tab="interact"]');
  await new Promise(r => setTimeout(r, 500));
  await page.type('#interactDrug1', '布洛芬', { delay: 50 });
  await page.type('#interactDrug2', '阿司匹林', { delay: 50 });
  await page.click('#interactBtn');
  await new Promise(r => setTimeout(r, 1000));
  const interactResult = await page.evaluate(() => {
    const el = document.getElementById('interactResult');
    return el ? el.textContent.slice(0, 200) : 'NOT FOUND';
  });
  console.log('相互作用 布洛芬+阿司匹林 结果:', interactResult);

  // 测试：我的页面
  await page.click('[data-tab="profile"]');
  await new Promise(r => setTimeout(r, 500));
  const profileTitle = await page.evaluate(() => document.getElementById('profileTitle')?.textContent);
  const profileEditBtn = await page.evaluate(() => document.getElementById('profileEditBtn')?.textContent);
  console.log('我的页面:', profileTitle, '|', profileEditBtn);

  await page.screenshot({ path: 'shot_final.png', fullPage: false });
  console.log('✅ shot_final.png');

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
