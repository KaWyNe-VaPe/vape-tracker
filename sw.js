// Version de réinitialisation
const CACHE_NAME = 'vape-tracker-reset';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Supprime TOUS les anciens caches accumulés qui bloquent l'affichage
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => caches.delete(cache))
            );
        }).then(() => self.clients.claim())
    );
});

// Laisse passer toutes les requêtes directement vers Internet
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
