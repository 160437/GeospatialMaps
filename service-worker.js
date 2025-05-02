const cacheName = 'geo-voice-cache-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/info.html',
  '/style.css',
  '/info.css',
  '/app.js',
  '/info.js',
  '/places.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      await Promise.allSettled(filesToCache.map((file) => cache.add(file)));
    })
  );
});


self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
