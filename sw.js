/* ============================================
Service Worker - R2 Nusantara v7.0
Offline Support & Robust Cache Strategy
============================================ */
const CACHE_NAME = 'r2-nusantara-v7.1';
const OFFLINE_URL = '404.html';

// Critical assets to cache using relative paths
const CORE_ASSETS = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'data.js',
  'manifest.json',
  'assets/logo/logo.png',
  'assets/logo/preview.jpg',
  'assets/logo/hero-bg.jpg',
  'assets/logo/footer-bg.jpg',
  'assets/logo/watermark.png',
  'assets/logo/loader-bg.jpg',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&family=JetBrains+Mono:wght@500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SW] Cache install error:', err))
  );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ===== FETCH EVENT - Network First Strategy =====
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  if (event.request.url.includes('wa.me') || 
      event.request.url.includes('maps.google') ||
      event.request.url.includes('chatling.ai')) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        if (event.request.destination === 'document') {
          const offlineResponse = await caches.match(OFFLINE_URL);
          if (offlineResponse) return offlineResponse;
        }
        if (event.request.destination === 'image') {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#F8FAFC" width="100" height="100"/><text x="50" y="55" font-size="12" fill="#94A3B8" text-anchor="middle">No Image</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
