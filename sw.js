var CACHE='qhy-v2';
var ASSETS=['./demo.html','./kb.json','./manifest.json'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}));self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}));self.clients.claim();});
self.addEventListener('fetch',function(e){e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request).then(function(resp){if(resp.ok){var clone=resp.clone();caches.open(CACHE).then(function(c){c.put(e.request,clone);});}return resp;}).catch(function(){return caches.match('./demo.html');});}));});
