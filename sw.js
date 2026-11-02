const CACHE_NAME = 'ninja-signos-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  '../estilos.css',
  '../tema.css',
  '../tema.js',
  '../icon-192.png'
];

// Instalación: Guardar archivos en Caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activación: Limpiar cachés antiguas si actualizas la app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones (Modo Offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en caché, lo devuelve. Si no, lo baja de internet.
        return response || fetch(event.request);
      })
  );
});