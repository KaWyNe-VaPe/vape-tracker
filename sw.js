const CACHE_NAME = 'vape-tracker-v3';

// 1. Installation du Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 2. Activation : Nettoyage immédiat de TOUS les anciens caches (v1, v2, etc.)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    return caches.delete(cache); // Supprime tout l'ancien cache
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Interception des requêtes : Réseau en priorité, secours sur le Cache si hors-ligne
self.addEventListener('fetch', (event) => {
    // Ne pas intercepter ce qui n'est pas en GET (ex: POST)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Si la requête réseau réussit, on met à jour le cache en arrière-plan
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // En cas de panne réseau (hors-ligne), on utilise le cache
                return caches.match(event.request);
            })
    );
});

// 4. Gestion des clics sur notifications PWA
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
