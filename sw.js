const CACHE_NAME = 'shanti-offline-v6-cachefirst';
const urlsToCache = [
  './',
  './index.html',
  './src/css/style.css',
  './src/js/app.js',
  './src/js/modules/audio-manager.js',
  './src/js/modules/breathing-exercise.js',
  './src/js/modules/mantra-counter.js',
  './src/js/modules/meditation-timer.js',
  './src/js/modules/ui-effects.js',
  './src/js/modules/data-manager.js',
  './src/js/modules/online-manager.js',
  './src/js/modules/daily-wisdom.js',
  './manifest.json'
];

// External CDN resources - cache at runtime
const cdnUrls = [
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
];

// Install event - cache all essential files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Essential files cached');
        return self.skipWaiting();
      })
      .catch(err => console.error('[SW] Install failed:', err))
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - CacheFirst strategy for EVERYTHING (offline-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately
          // Optionally update cache in background (stale-while-revalidate)
          fetch(event.request)
            .then(response => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, response.clone());
                });
              }
            })
            .catch(() => {/* Network failed, cached version already served */ });

          return cachedResponse;
        }

        // Not in cache, try network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Cache successful responses from our origin
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);

            // For navigation requests, return cached index.html as fallback
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }

            throw error;
          });
      })
  );
});

// Message handler for manual cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
