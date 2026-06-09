const CACHE_NAME = 'unit-games-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  // Afegeix aquí altres arxius estàtics importants si n'hi hagués (CSS, imatges, etc.)
  // Per ara, la majoria de recursos es carreguen via CDN, així que no cal afegir-los.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Si no està a la caché, fes la petició a la xarxa
        return fetch(event.request).then(
          response => {
            // Comprova si hem rebut una resposta vàlida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              // No cachejem respostes d'altres dominis (CDNs) en aquesta configuració bàsica
              return response;
            }
            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});