const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  // 在脚本执行前注入探测
  await page.evaluateOnNewDocument(() => {
    window.__probe = {};
    const origAdd = window.addEventListener;
    // 记录所有 window 属性
    window.__probe.props = Object.keys(window).sort();
  });

  const logs = [];
  page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));

  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 检查关键全局函数
  const check = await page.evaluate(() => {
    return {
      applyLang: typeof window.applyLang,
      currentLang: typeof window.currentLang,
      startApp: typeof window.startApp,
      afterSplash: typeof window.afterSplash,
      windowKeys: Object.keys(window).filter(k => k.includes('Lang') || k.includes('App') || k.includes('Start') || k.includes('Cy') || k.includes('T_') || k.includes('toggle') || k.includes('show')).sort(),
      scriptCount: document.querySelectorAll('script').length,
      scriptSrcs: Array.from(document.querySelectorAll('script')).map(s => s.src || s.type || 'inline').slice(0, 10),
    };
  });
  console.log('全局检查:', JSON.stringify(check, null, 2));
  console.log('最后5条日志:', logs.slice(-5).join('\n'));

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
