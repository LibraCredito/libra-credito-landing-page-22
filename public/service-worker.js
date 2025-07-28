
const CACHE_VERSION = 'v3';
const CACHE_NAME = `libra-credito-cache-${CACHE_VERSION}`;
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-${CACHE_VERSION}`;

// Critical resources to cache immediately
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/index.css',
  '/lovable-uploads/0be9e819-3b36-4075-944b-cf4835a76b3c.png'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Handle different types of requests
  if (request.url.includes('youtube.com') || request.url.includes('img.youtube.com')) {
    // YouTube content - cache with short TTL
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            // Check if cached version is still fresh (1 hour)
            const cachedTime = new Date(response.headers.get('sw-cached-at') || 0);
            const isExpired = Date.now() - cachedTime.getTime() > 3600000; // 1 hour
            
            if (!isExpired) {
              return response;
            }
          }
          
          return fetch(request).then(fetchResponse => {
            if (fetchResponse.status === 200) {
              const responseToCache = fetchResponse.clone();
              // Add timestamp header
              const headers = new Headers(responseToCache.headers);
              headers.set('sw-cached-at', new Date().toISOString());
              
              const modifiedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers
              });
              
              cache.put(request, modifiedResponse.clone());
              return fetchResponse;
            }
            return fetchResponse;
          }).catch(() => response || new Response('Offline content not available'));
        });
      })
    );
  } else {
    // Regular content - cache-first strategy
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response;
        }
        
        return fetch(request).then(fetchResponse => {
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }
          
          const responseToCache = fetchResponse.clone();
          const cacheName = request.url.includes('/dist/') || request.url.includes('/lovable-uploads/')
            ? STATIC_CACHE
            : DYNAMIC_CACHE;
          
          caches.open(cacheName).then(cache => {
            cache.put(request, responseToCache);
          });
          
          return fetchResponse;
        });
      })
    );
  }
});
