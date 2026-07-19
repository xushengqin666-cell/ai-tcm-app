const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const http = require('http');
const PORT = 18800, URL = 'http://127.0.0.1:' + PORT + '/';

function waitServer(t){return new Promise((res,rej)=>{const t0=Date.now();(function p(){const r=http.get(URL,x=>{x.resume();res(true);});r.on('error',()=>{Date.now()-t0>t?rej(new Error('timeout')):setTimeout(p,300);});})();});}

(async () => {
  const srv = spawn('node', ['_serve.js'], { cwd: __dirname, stdio:'ignore' });
  try { await waitServer(10000); } catch(e){ console.log('server fail',e.message); srv.kill(); process.exit(1); }
  const browser = await puppeteer.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:'new', args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setViewport({ width:390, height:844, isMobile:true, hasTouch:true });

  // ===== A) 首次打开：登录闸门 =====
  console.log('=== A) 首次打开（清 localStorage）===');
  await page.goto(URL, { waitUntil:'networkidle2', timeout:30000 });
  await page.evaluate(() => { try{ localStorage.clear(); }catch(e){} });
  await page.reload({ waitUntil:'networkidle2' });
  await new Promise(r=>setTimeout(r,3000));
  const authState = await page.evaluate(() => {
    const gate = document.getElementById('authGate');
    const splash = document.querySelector('.splash-screen');
    const hasLogin = !!(document.getElementById('loginForm') || document.querySelector('input[type="tel"],input[type="phone"],input[placeholder*="手机"]'));
    const phoneInput = document.querySelector('input[type="tel"],input[placeholder*="手机"],input[placeholder*="电话"]');
    return { splashGone: !splash, gateVisible: gate ? (getComputedStyle(gate).display !== 'none') : 'no-gate', hasLoginForm: hasLogin, phoneInputExists: !!phoneInput };
  });
  console.log('  splash消失:', authState.splashGone);
  console.log('  登录闸门可见:', authState.gateVisible);
  console.log('  有登录表单:', authState.hasLoginForm);
  console.log('  手机号输入框:', authState.phoneInputExists);

  // ===== B) Chat 真实回复内容 =====
  console.log('\n=== B) Chat 真实回复内容 ===');
  await page.evaluate(() => { try{ localStorage.setItem('cy_session', JSON.stringify({user:'tester',ts:Date.now()})); }catch(e){} });
  await page.reload({ waitUntil:'networkidle2' });
  await new Promise(r=>setTimeout(r,3000));
  await page.evaluate(() => { window.switchTab('chat'); document.getElementById('chatInput').value='布洛芬能空腹吃吗，会有什么副作用'; window.sendChat(); });
  await new Promise(r=>setTimeout(r,9000));
  const chatTxt = await page.evaluate(() => { const el=document.getElementById('chatMessages'); return el ? el.innerText : ''; });
  console.log('  Chat 文本长度:', chatTxt.length);
  console.log('  Chat 前300字:', chatTxt.slice(0,300));
  const isFallback = /本地知识库暂无|暂时不可用|未能获取/.test(chatTxt);
  console.log('  是否兜底空话:', isFallback ? '是(无真实AI)' : '否(有真实回复)');

  // ===== C) OCR 流程不崩溃 =====
  console.log('\n=== C) 拍照/OCR 入口不崩溃 ===');
  const camOk = await page.evaluate(() => {
    try {
      const btn = document.getElementById('drugCameraBtn');
      return !!btn;
    } catch(e){ return 'ERR:'+e.message; }
  });
  console.log('  拍照按钮存在:', camOk);

  await browser.close();
  srv.kill();
  process.exit(0);
})().catch(e=>{ console.error('FATAL', e.message); process.exit(1); });
