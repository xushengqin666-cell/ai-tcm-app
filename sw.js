// Service Worker for 彩云智药 - v2.21.0
const CACHE_NAME = 'caiyun-pharmacy-v2210';
const ASSETS_TO_CACHE = [
  '/ai-tcm-app/app_v38.html',
  '/ai-tcm-app/manifest.json',
  '/ai-tcm-app/icons/icon-192.svg',
  '/ai-tcm-app/icons/icon-512.svg',
  '/ai-tcm-app/icons/favicon.svg',
  '/ai-tcm-app/icons/apple-touch-icon.svg'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API calls (should always go to network)
  if (event.request.url.includes('api.') || 
      event.request.url.includes('dashscope') ||
      event.request.url.includes('groq')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version or fetch from network
        if (cachedResponse) {
          // Update cache in background
          fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Offline fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/ai-tcm-app/app_v38.html');
            }
          });
      })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[SW] Background sync triggered');
    // Future: sync cabinet data, reminders, etc.
  }
});

// Handle push notifications (for reminders)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '该服药了',
    icon: '/ai-tcm-app/icons/icon-192.svg',
    badge: '/ai-tcm-app/icons/favicon.svg',
    vibrate: [200, 100, 200],
    tag: 'medication-reminder',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('彩云智药提醒', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/ai-tcm-app/app_v38.html')
  );
});
