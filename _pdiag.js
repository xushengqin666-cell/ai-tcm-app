const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=390,844', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  const errs = [];
  page.on('pageerror', e => errs.push('[pageerror] ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('[err] ' + m.text()); });
  await page.goto('http://127.0.0.1:18800/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  const diag = await page.evaluate(() => {
    const out = {};
    out.searchInputExists = !!document.getElementById('searchInput');
    out.searchResultExists = !!document.getElementById('searchResult');
    out.doSearchType = typeof window.doSearch;
    out.findDrugManualType = typeof window.findDrugManual;
    out.matchDrugsType = typeof window.matchDrugsBySymptom;
    // 直接调 doSearch
    try {
      document.getElementById('searchInput').value = '布洛芬';
      window.doSearch();
      out.afterIbuprofen = document.getElementById('searchResult').innerHTML.length;
      out.ibuprofenHasIndication = document.getElementById('searchResult').innerHTML.includes('适应症');
    } catch (e) { out.errIbuprofen = e.message; }

    try {
      document.getElementById('searchInput').value = '我的脚疼';
      window.doSearch();
      out.afterFootPain = document.getElementById('searchResult').innerHTML.length;
      out.footPainHasIbuprofen = document.getElementById('searchResult').innerHTML.includes('布洛芬');
    } catch (e) { out.errFootPain = e.message; }

    // 检查 findDrugManual / matchDrugsBySymptom 单独调用
    try {
      const r = window.findDrugManual ? window.findDrugManual('布洛芬') : 'N/A';
      out.findDrugManualIbu = Array.isArray(r) ? ('len=' + r.length) : r;
    } catch (e) { out.errFind = e.message; }
    try {
      const r = window.matchDrugsBySymptom ? window.matchDrugsBySymptom('脚疼') : 'N/A';
      out.matchFoot = Array.isArray(r) ? ('len=' + r.length) : r;
    } catch (e) { out.errMatch = e.message; }
    return out;
  });
  console.log(JSON.stringify(diag, null, 2));
  console.log('\nERRORS:', errs.length ? errs.join('\n') : 'none');
  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
