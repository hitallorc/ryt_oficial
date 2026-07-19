const CACHE_NAME = 'ryt-app-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Força a atualização imediata
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Busca sempre da rede para garantir que os utilizadores veem o código mais recente do MVP
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});