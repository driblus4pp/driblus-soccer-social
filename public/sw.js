
const CACHE_NAME = 'driblus-v1.0.0';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/lovable-uploads/driblus-icon-192.png',
  '/lovable-uploads/driblus-icon-420.png',
  '/lovable-uploads/driblus-icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event
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
});

// Push notification
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova reserva confirmada!',
    icon: '/lovable-uploads/driblus-icon-192.png',
    badge: '/lovable-uploads/driblus-icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Detalhes',
        icon: '/lovable-uploads/driblus-icon-192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/lovable-uploads/driblus-icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Driblus', options)
  );
});
