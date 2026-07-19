const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  const logs = [];
  page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));

  // 设置 EN 语言并刷新
  await page.goto('http://127.0.0.1:18800/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.evaluate(() => {
    localStorage.setItem('lang', 'en');
  });
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6000)); // 等 splash 完成

  // 截图首页
  await page.screenshot({ path: 'shot_home_en.png', fullPage: false });

  // 检查关键元素
  const result = await page.evaluate(() => {
    return {
      // 症状搜药
      homeSymptomTitle: document.getElementById('homeSymptomTitle')?.textContent,
      homeSymptomInput: document.getElementById('homeSymptomInput')?.placeholder,
      homeSymptomBtn: document.getElementById('homeSymptomBtn')?.textContent,
      // 药品说明书
      manualTitle: document.getElementById('manualTitle')?.textContent,
      manualInput: document.getElementById('manualInput')?.placeholder,
      manualBtn: document.getElementById('manualBtn')?.textContent,
      // 药箱表单
      cabAddTitle: document.getElementById('cabAddTitle')?.textContent,
      cabNameLabel: document.getElementById('cabNameLabel')?.textContent,
      cabNameInput: document.getElementById('cabNameInput')?.placeholder,
      // 舌象选择器
      tongueSelectOpt0: document.getElementById('tongueSelect')?.options[0]?.textContent,
      tongueSelectOpt1: document.getElementById('tongueSelect')?.options[1]?.textContent,
      // 脉象选择器
      pulseSelectOpt0: document.getElementById('pulseSelect')?.options[0]?.textContent,
      // AI Chat 按钮
      cameraBtn: document.getElementById('cameraBtn')?.textContent,
      manualInputBtn: document.getElementById('manualInputBtn')?.textContent,
      // 底部导航
      navHome: document.getElementById('navHome')?.textContent,
      currentLang: window.currentLang,
    };
  });

  console.log('EN 翻译检查结果:');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n错误日志:', logs.filter(l => l.startsWith('error')).join('\n'));

  console.log('✅ shot_home_en.png');
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
