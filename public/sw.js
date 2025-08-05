// Service Worker para Performance - Libra Crédito
const CACHE_NAME = 'libra-credito-v1';
const STATIC_CACHE_NAME = 'libra-static-v1';
const DYNAMIC_CACHE_NAME = 'libra-dynamic-v1';

// Recursos para cache estático (críticos)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/styles/critical.css',
  '/manifest.json'
];
// Logos e ícones grandes serão armazenados no cache dinâmico após o primeiro uso

// Precache desativado para reduzir requisições iniciais
const PRECACHE_ASSETS = [];

// Estratégias de cache
const CACHE_STRATEGIES = {
  // Cache First - Para recursos estáticos
  CACHE_FIRST: 'cache-first',
  // Network First - Para dados dinâmicos
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate - Para recursos que podem estar desatualizados
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install - Cache recursos estáticos
self.addEventListener('install', (event) => {
  console.log('SW: Install event');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - Limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('SW: Activate event');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Assumir controle imediatamente
      self.clients.claim()
    ])
  );
});

// Fetch - Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests não-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Ignorar requests da extensão do Chrome
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Ignorar métodos não-GET para cache
  if (request.method !== 'GET') {
    return;
  }

  // Ignorar requests com dados de formulário
  if (request.url.includes('form') || request.url.includes('submit')) {
    return;
  }

  event.respondWith(handleFetch(request));
});

// Handler principal para fetch
async function handleFetch(request) {
  const url = new URL(request.url);
  
  // Verificações adicionais de segurança
  if (!isCacheableRequest(request)) {
    return fetch(request);
  }
  
  try {
    // Estratégia baseada no tipo de recurso
    if (isStaticAsset(url)) {
      return await cacheFirst(request, STATIC_CACHE_NAME);
    } else if (isAPIRequest(url)) {
      return await networkFirst(request, DYNAMIC_CACHE_NAME);
    } else if (isImageRequest(url)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
    } else {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
    }
  } catch (error) {
    console.error('SW: Fetch error:', error);
    return await handleOffline(request);
  }
}

// Verificar se request pode ser cacheado
function isCacheableRequest(request) {
  // Apenas GET requests
  if (request.method !== 'GET') {
    return false;
  }
  
  // Não cachear requests com query strings específicas
  const url = new URL(request.url);
  if (url.search.includes('no-cache') || url.search.includes('timestamp')) {
    return false;
  }
  
  // Não cachear requests com headers específicos
  if (request.headers.get('cache-control') === 'no-store') {
    return false;
  }
  
  return true;
}

// Cache First - Para recursos estáticos
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok && request.method === 'GET') {
    try {
      cache.put(request, networkResponse.clone());
    } catch (error) {
      console.log('SW: Cache put failed:', error);
    }
  }
  
  return networkResponse;
}

// Network First - Para dados dinâmicos
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      try {
        cache.put(request, networkResponse.clone());
      } catch (error) {
        console.log('SW: Cache put failed:', error);
      }
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate - Para recursos que podem estar desatualizados
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch em background para atualizar cache
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok && request.method === 'GET') {
      try {
        cache.put(request, networkResponse.clone());
      } catch (error) {
        console.log('SW: Cache put failed:', error);
      }
    }
    return networkResponse;
  }).catch(() => {
    // Falha silenciosa
  });
  
  // Retornar cache imediatamente se disponível
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Senão, aguardar network
  return await fetchPromise;
}

// Verificadores de tipo de recurso
function isStaticAsset(url) {
  return (
    url.pathname.includes('/static/') ||
    url.pathname.includes('/assets/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff')
  );
}

function isAPIRequest(url) {
  return (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('api') ||
    url.pathname.includes('simulacao')
  );
}

function isImageRequest(url) {
  return (
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.avif') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  );
}

// Handler para quando offline
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // Para navegação, retornar página offline ou index em cache
  if (request.mode === 'navigate') {
    const cache = await caches.open(STATIC_CACHE_NAME);
    return await cache.match('/') || new Response('Página não disponível offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
  
  // Para imagens, retornar placeholder
  if (isImageRequest(url)) {
    return new Response(
      '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Imagem indisponível</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
  
  throw new Error('Offline and no cache available');
}

// Background Sync para requests offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Implementar sync de dados quando voltar online
  console.log('SW: Background sync triggered');
}

// Push notifications (futuro)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: data.data
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Periodic Background Sync (futuro)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  // Atualizar conteúdo em background
  console.log('SW: Periodic sync - updating content');
}