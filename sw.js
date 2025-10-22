/* This is the new file: sw.js */

const CACHE_NAME = 'offline-temple-v1';

/*
  IMPORTANT: Add ALL your files here.
  This list tells the browser what to save.
  '/' represents your main index.html file.
*/
const FILES_TO_CACHE = [
  '/', // This caches the index.html file
  'temple1.jpg',
  'landscape.jpg',
  'mountain.jpg',
  'ocean.jpg'
  // Add any other .css, .js, or image files here
];

// 1. On "install" (when the user first visits)
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  
  // We wait until the cache is open and all files are added
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// 2. On "activate" (when the service worker starts)
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // This removes any old caches
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. On "fetch" (when the page tries to load any file)
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  // This is the "offline-first" part.
  // It tries to find the file in the cache *first*.
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      // If it's in the cache, return it.
      // If not, try to get it from the network.
      return response || fetch(evt.request);
    })
  );
});
