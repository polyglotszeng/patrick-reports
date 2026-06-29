// 新疆自驾 PWA Service Worker
const CACHE_NAME = 'xjb-v8-' + Date.now();
const CORE_ASSETS = [
  '/xjb-public',
  '/xjb-gear',
  '/视频库/',
  '/视频库/live_info',
  '/视频库/day_recommend',
  '/视频库/xjb_overview_map',
  '/视频库/index',
  '/视频库/video_06',
  '/视频库/video_11',
  '/视频库/video_14',
  '/视频库/video_20',
  '/视频库/video_23',
  '/视频库/video_26',
  '/视频库/video_28',
  '/视频库/video_29',
  '/视频库/video_30',
  '/xjb-icon-192.png',
  '/xjb-icon-512.png',
  '/manifest.json',
];

// Install: 预缓存核心页面
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[SW] cache.addAll partial fail:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: 清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('xjb-') && k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Network-first, fallback to cache
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Same-origin only
  if (url.origin !== location.origin) return;
  // 跳过 API/动态请求
  if (url.pathname.startsWith('/api/')) return;
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        // 成功: clone + cache
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return resp;
      })
      .catch(() => {
        // 失败: 离线 cache fallback
        return caches.match(e.request).then((cached) => {
          return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
