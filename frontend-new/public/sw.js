// Service Worker for CipherStudio
const CACHE_NAME = 'cipherstudio-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/vite.svg',
  '/assets/index-*.js',
  '/assets/index-*.css'
];

// Don't cache API requests
const isApiRequest = (request) => {
  return request.url.includes('/api/');
};

// Don't cache non-GET requests
const isNonGetRequest = (request) => {
  return request.method !== 'GET';
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests and API requests
  if (isNonGetRequest(request) || isApiRequest(request)) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache if response is not valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
              
            return response;
          });
      })
  );
});
