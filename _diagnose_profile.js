const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  const BASE = 'http://132.232.141.186:9033';

  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 7000));

  // 1. 检查 Profile 页面是否正常
  await page.evaluate(() => switchTab('profile'));
  await new Promise(r => setTimeout(r, 1000));

  // 2. 检查按钮 onclick 是否绑定
  const btnInfo = await page.evaluate(() => {
    return {
      profileEditBtn: {
        exists: !!document.getElementById('profileEditBtn'),
        onclick: document.getElementById('profileEditBtn')?.getAttribute('onclick'),
        text: document.getElementById('profileEditBtn')?.textContent,
      },
      profileSettingsBtn: {
        exists: !!document.getElementById('profileSettingsBtn'),
        onclick: document.getElementById('profileSettingsBtn')?.getAttribute('onclick'),
      },
      profileAboutBtn: {
        exists: !!document.getElementById('profileAboutBtn'),
        onclick: document.getElementById('profileAboutBtn')?.getAttribute('onclick'),
      },
      profileLogoutBtn: {
        exists: !!document.getElementById('profileLogoutBtn'),
        onclick: document.getElementById('profileLogoutBtn')?.getAttribute('onclick'),
      },
      // 函数是否定义
      editProfileType: typeof editProfile,
      showAboutType: typeof showAbout,
      logoutType: typeof logout,
      // prompt 是否可用
      promptType: typeof window.prompt,
    };
  });
  console.log('按钮信息:', JSON.stringify(btnInfo, null, 2));

  // 3. 尝试点击编辑资料按钮
  const dialogPromise = new Promise(resolve => {
    page.once('dialog', async dialog => {
      console.log('⚠️ 浏览器对话框出现:', dialog.message());
      await dialog.dismiss();
      resolve('dismissed');
    });
    setTimeout(() => resolve('no-dialog'), 3000);
  });
  
  console.log('\n点击 编辑资料 按钮...');
  await page.click('#profileEditBtn').catch(e => console.log('click err:', e.message));
  const dialogResult = await dialogPromise;
  console.log('对话框结果:', dialogResult);

  await page.screenshot({ path: 'shot_diagnose.png', fullPage: false });
  console.log('\n✅ shot_diagnose.png');
  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
