/* ============================================
Service Worker - R2 Nusantara v7.0
Offline Support & Cache Strategy
============================================ */
const CACHE_NAME = 'r2-nusantara-v7.0';
const OFFLINE_URL = '/404.html';

// Critical assets to cache on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/data.js',
  '/manifest.json',
  '/assets/logo/logo.png',
  '/assets/logo/preview.jpg',
  '/assets/logo/hero-bg.jpg',
  '/assets/logo/footer-bg.jpg',
  '/assets/logo/watermark.png',
  '/assets/logo/loader-bg.jpg',
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
      .catch((err) => console.warn('[SW] Cache install failed:', err))
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
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external APIs (allow network)
  if (event.request.url.includes('wa.me') || 
      event.request.url.includes('maps.google') ||
      event.request.url.includes('chatling.ai')) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try network first
        const networkResponse = await fetch(event.request);
        
        // Cache successful responses
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        // Network failed - try cache
        console.log('[SW] Network failed, trying cache:', event.request.url);
        const cachedResponse = await caches.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If HTML request, return offline page
        if (event.request.destination === 'document') {
          const offlineResponse = await caches.match(OFFLINE_URL);
          if (offlineResponse) return offlineResponse;
        }
        
        // Fallback for images
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

// ===== MESSAGE HANDLER =====
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
