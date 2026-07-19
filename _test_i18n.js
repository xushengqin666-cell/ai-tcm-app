const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGE: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CON: ' + m.text()); });
  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 登录闸门（如果有）跳过
  await page.evaluate(() => {
    localStorage.setItem('cy_users', '[]');
    localStorage.setItem('cy_session', '""');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // 切换到英文
  const checkIds = ['tabCabinetBtn','homeSymptomTitle','symptomInput','homeSymptomBtn',
    'manualCardTitle','drugManualInput','drugManualBtn',
    'cabAddTitle','cabNameLabel','cabName','cabSpecLabel','cabSpec','cabQtyLabel','cabQty',
    'cabExpiryLabel','cabMemberLabel','cabAddBtn','cabStatOk','cabStatWarn','cabStatBad',
    'cameraBtnLabel','manualInputBtn'];

  // 先检查 ID 存在
  const idExists = await page.evaluate((ids) => {
    return ids.map(id => ({ id, ok: !!document.getElementById(id) }));
  }, checkIds);
  console.log('=== ID 存在性 ===');
  idExists.forEach(x => console.log('  ' + (x.ok ? '✅' : '❌') + ' ' + x.id));

  // === 英文模式 ===
  await page.evaluate(() => { localStorage.setItem('lang', 'en'); });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  const enTexts = await page.evaluate((ids) => {
    return ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return { id, text: 'NULL' };
      return { id, text: (el.placeholder || el.textContent || '').trim().slice(0, 50) };
    });
  }, checkIds);
  console.log('\n=== 英文模式（lang=en）===');
  enTexts.forEach(x => console.log('  ' + x.id + ' = "' + x.text + '"'));

  // 检查 select placeholder
  const enSel = await page.evaluate(() => {
    const t = document.getElementById('reportTongue');
    const p = document.getElementById('reportPulse');
    const cm = document.getElementById('cabMember');
    return {
      tongueOpt0: t && t.options[0] ? t.options[0].text : 'NULL',
      pulseOpt0: p && p.options[0] ? p.options[0].text : 'NULL',
      cabMember: cm ? Array.from(cm.options).map(o => o.text) : []
    };
  });
  console.log('\n=== 英文 下拉 ===');
  console.log('  reportTongue[0] =', enSel.tongueOpt0);
  console.log('  reportPulse[0] =', enSel.pulseOpt0);
  console.log('  cabMember =', JSON.stringify(enSel.cabMember));

  // === 中文模式 ===
  await page.evaluate(() => { localStorage.setItem('lang', 'zh'); });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  const zhTexts = await page.evaluate((ids) => {
    return ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return { id, text: 'NULL' };
      return { id, text: (el.placeholder || el.textContent || '').trim().slice(0, 50) };
    });
  }, checkIds);
  console.log('\n=== 中文模式（lang=zh）===');
  zhTexts.forEach(x => console.log('  ' + x.id + ' = "' + x.text + '"'));

  const zhSel = await page.evaluate(() => {
    const t = document.getElementById('reportTongue');
    const cm = document.getElementById('cabMember');
    return {
      tongueOpt0: t && t.options[0] ? t.options[0].text : 'NULL',
      cabMember: cm ? Array.from(cm.options).map(o => o.text) : []
    };
  });
  console.log('  tongue[0] =', zhSel.tongueOpt0);
  console.log('  cabMember =', JSON.stringify(zhSel.cabMember));

  console.log('\n=== JS 错误 ===');
  if (errors.length === 0) console.log('  ✅ 无错误');
  else errors.forEach(e => console.log('  ❌ ' + e));

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
