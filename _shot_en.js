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
  await page.evaluate(() => { localStorage.setItem('cy_users','[]'); localStorage.setItem('cy_session','""'); localStorage.setItem('lang','en'); });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  // 1) Home
  await page.screenshot({ path: 'shot_en_home.png' });
  console.log('✅ shot_en_home.png');

  // 2) Cabinet tab
  await page.evaluate(() => { window.openCabinet && window.openCabinet(); });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'shot_en_cabinet.png' });
  console.log('✅ shot_en_cabinet.png');

  // 3) Diagnosis tab
  await page.evaluate(() => { var tabs=document.querySelectorAll('.tab-btn,[data-tab]'); tabs.forEach(t=>{ if(t.dataset && t.dataset.tab==='report') t.click(); }); });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'shot_en_diagnosis.png' });
  console.log('✅ shot_en_diagnosis.png');

  // 4) AI Chat tab
  await page.evaluate(() => { var tabs=document.querySelectorAll('.tab-btn,[data-tab]'); tabs.forEach(t=>{ if(t.dataset && t.dataset.tab==='chat') t.click(); }); });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'shot_en_chat.png' });
  console.log('✅ shot_en_chat.png');

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
