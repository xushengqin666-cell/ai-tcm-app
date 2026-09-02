// sw.js - PWA Service Worker (家庭药师 v5)
// 策略：
//   - 页面导航（HTML）：网络优先，失败时回退缓存（保证始终拿到最新版）
//   - 其它同源静态资源：缓存优先（离线可用）
//   - OCR 的 wasm 内核与语言包由 fetch 处理器按需缓存
const CACHE = 'caiyun-pharmacy-v6.10.1';
const ASSETS = [
  './',
  './index.html',
  './cabinet.html',
  './tcmengine.js',
  './syncengine.js',
  './drugnames.js',
  './drugpinyin.js',
  './healthwiki.js',
  './drugdetail.js',
  './drugpreg.js',
  './drugpedia.js',
  './ocr/tesseract.min.js',
  './ocr/worker.min.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // 仅处理同源资源
  if (url.origin !== self.location.origin) return;

  const isNav = e.request.mode === 'navigate';

  if (isNav) {
    // 网络优先：确保用户看到最新版本；断网时回退缓存
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() =>
        caches.match(e.request).then(cached => cached || caches.match('./index.html'))
      )
    );
    return;
  }

  // 静态资源：缓存优先，未命中则联网并缓存
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
