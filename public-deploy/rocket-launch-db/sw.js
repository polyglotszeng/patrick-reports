// rocket-launch-db v3 PWA service worker
// Strategy: stale-while-revalidate for data JSON; cache-first for HTML/CSS/JS/satellite.js CDN
const CACHE_NAME = "rockets-v3-2026-07-06";
const STATIC = [
  "./",
  "./index.html",
  "./manifest.json",
  "./data/stats.json",
  "./data/sources.json",
  "./data/objects.json",
  "./data/timeline.json"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // CDN: cache-first (satellite.js, cesium.js if loaded)
  if (url.host === "cdn.jsdelivr.net") {
    e.respondWith(caches.match(e.request).then(r => r ||
      fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        return resp;
      }).catch(() => r)));
    return;
  }
  // data JSON: stale-while-revalidate
  if (url.pathname.startsWith("/rocket-launch-db/data/") || url.pathname.includes("/data/")) {
    e.respondWith(caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(e.request);
      const network = fetch(e.request).then(resp => {
        if (resp.ok) cache.put(e.request, resp.clone());
        return resp;
      }).catch(() => null);
      return cached || (await network) || new Response(JSON.stringify({offline:true,records:[]}), {headers:{"Content-Type":"application/json"}});
    }));
    return;
  }
  // Same-origin: network-first, fallback to cache
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
      return resp;
    }).catch(() => caches.match(e.request)));
  }
});
