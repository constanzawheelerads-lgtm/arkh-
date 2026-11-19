// Arkhé service worker: lets the web app open and run without a connection.
// - App pages: network first, falling back to the cached copy.
// - Built assets (hashed file names) and card images: cache first.
// Card images can be downloaded all at once from Profile → "Offline library".

const SHELL = 'arkhe-shell-v1';
const CARDS = 'arkhe-cards-v1';
const KEEP = [SHELL, CARDS];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(['./', './index.html'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('arkhe-') && !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(cacheName, request) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

async function networkFirst(request) {
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put('./index.html', res.clone());
    return res;
  } catch {
    return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Supabase, fonts, etc. go straight to the network.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (url.pathname.includes('/cards/')) {
    event.respondWith(cacheFirst(CARDS, request));
  } else if (url.pathname.includes('/assets/')) {
    event.respondWith(cacheFirst(SHELL, request));
  }
});
