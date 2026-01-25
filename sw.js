const CACHE_NAME = 'shanti-offline-v4-networkfirst';
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
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
];

// Strategies
const strategies = {
  cacheFirst: async (request) => {
    const cached = await caches.match(request);
    return cached || fetch(request).then(response => {
      return caches.open(CACHE_NAME).then(cache => {
        cache.put(request, response.clone());
        return response;
      });
    });
  },
  networkFirst: async (request) => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }
      throw new Error('Network response was not ok');
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) return cached;
      // Fallback for navigation
      if (request.mode === 'navigate') {
        return caches.match('./index.html');
      }
      throw error;
    }
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation requests (HTML) -> Network First
  if (event.request.mode === 'navigate') {
    event.respondWith(strategies.networkFirst(event.request));
    return;
  }

  // Static Assets -> Cache First
  event.respondWith(strategies.cacheFirst(event.request));
});
