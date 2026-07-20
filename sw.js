const CACHE_NAME = 'japan-missions-v14';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './dbHelper.js',
    './games.js',
    './missions.js',
    './missions_days_1_8.js',
    './missions_days_9_16.js',
    './missions_days_17_24.js',
    './firebase-app-compat.js',
    './firebase-firestore-compat.js',
    './firebase-sync.js',
    './app.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(ASSETS))
        .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request);
        })
        .catch(() => {
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});
