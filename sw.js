const CACHE_NAME = 'rs-control-v2';
const APP_SHELL = ['./', './index.html', './manifest.json', './logo.svg'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(key) {
        return key !== CACHE_NAME;
      }).map(function(key) { return caches.delete(key); }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);
  // Las peticiones a Apps Script siempre van a red para no mostrar datos antiguos.
  if (requestUrl.hostname === 'script.google.com' || requestUrl.hostname.endsWith('.googleusercontent.com')) return;
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then(function(response) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
      return response;
    }).catch(function() {
      return caches.match(event.request).then(function(cached) {
        return cached || caches.match('./index.html');
      });
    })
  );
});
