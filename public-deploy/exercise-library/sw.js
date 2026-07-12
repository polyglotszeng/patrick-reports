/* Service Worker — Exercise Library
 * Strategy (v2 — 中文版 + 完整 steps_zh/name_zh):
 *   - lean.json       → network-first (数据 1324 个动作, 1.4MB, 需实时更新)
 *   - GIFs / images   → cache-first with 30-day expiry (这些不变)
 *   - HTML / assets   → network-first, fallback to cache
 */
const CACHE = 'exlib-v2';
const ASSET_CACHE = 'exlib-assets-v2';
const ASSET_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './lean.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== ASSET_CACHE).map(k => caches.delete(k)))
    )
    // 强制 unregister 所有其他 sw (让旧 sw 立即失效, 避免旧 cache 干扰)
    .then(() => self.registration.unregister().catch(() => {}))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(e.request.method !== 'GET') return;

  // lean.json — network-first (HTML 动态加 ?v=N 也能绕开 cache)
  if(url.pathname.endsWith('/lean.json')){
    e.respondWith(
      fetch(e.request).then(net => {
        if(net.ok){
          const clone = net.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return net;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // GIFs / images — cache-first with age limit
  if(/\.(gif|jpg|jpeg|png|webp|svg)(\?|$)/i.test(url.pathname)){
    e.respondWith(
      caches.open(ASSET_CACHE).then(async cache => {
        const cached = await cache.match(e.request);
        if(cached){
          const dateHeader = cached.headers.get('sw-fetched-on');
          if(!dateHeader || (Date.now() - Number(dateHeader)) < ASSET_MAX_AGE_MS){
            return cached;
          }
        }
        try {
          const net = await fetch(e.request);
          if(net.ok){
            const cloned = new Response(await net.clone().blob(), {
              status: net.status,
              statusText: net.statusText,
              headers: new Headers([...net.headers, ['sw-fetched-on', String(Date.now())]])
            });
            cache.put(e.request, cloned.clone());
            return net;
          }
          if(cached) return cached;
          return net;
        } catch(err){
          if(cached) return cached;
          throw err;
        }
      })
    );
    return;
  }

  // HTML / manifest / same-origin assets — network-first, cache fallback
  e.respondWith(
    fetch(e.request).then(net => {
      if(net.ok && url.origin === location.origin){
        const clone = net.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return net;
    }).catch(() => caches.match(e.request))
  );
});