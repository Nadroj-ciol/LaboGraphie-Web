
/**
 * Service Worker - Labographie
 * Version moderne avec stratégie Stale-While-Revalidate
 */

const CACHE_NAME = 'labographie-v3.0.0';
const OFFLINE_URL = '/offline.html';

// Assets critiques à mettre en cache immédiatement
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/assets/css/global.css',
    '/assets/css/home.css',
    '/assets/js/main.js',
    '/assets/js/config.js',
    '/assets/images/logo.svg',
    '/manifest.json'
];

// Install event - Precacher les assets critiques
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Pré-cache des assets critiques');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Installation terminée');
                return self.skipWaiting();
            })
    );
});

// Activate event - Nettoyer les anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Suppression ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Activation terminée');
            return self.clients.claim();
        })
    );
});

// Fetch event - Stratégie Stale-While-Revalidate
self.addEventListener('fetch', event => {
    // Ignorer les requêtes non-GET
    if (event.request.method !== 'GET') return;
    
    // Ignorer les requêtes vers l'API
    if (event.request.url.includes('/api/')) return;
    
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(cachedResponse => {
                const fetchedResponse = fetch(event.request).then(networkResponse => {
                    // Mettre à jour le cache
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(() => {
                    // En cas d'erreur réseau
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // Si c'est une page et pas de cache, retourner offline
                    if (event.request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }
                    
                    return new Response('Network error', {
                        status: 408,
                        headers: { 'Content-Type': 'text/plain' }
                    });
                });
                
                // Retourner la réponse du cache immédiatement, puis mettre à jour
                return cachedResponse || fetchedResponse;
            });
        })
    );
});

// Gestion des messages
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
