// 新疆自驾 PWA Service Worker — v11: Web Push Notification 完整实现
// 模式参考 web.dev/push-notifications-overview
const CACHE_NAME = 'xjb-v11-' + Date.now();
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

// VAPID 公钥 (mock 占位, 真实部署时换为后端生成的 key pair)
const VAPID_PUBLIC_KEY = 'BK1pDThjr7tJqxQ6QyQ9fK8dZ2cM4nX5lP7vT8wH9jR6yN3sA1bC0eG';

// ================== Install: 预缓存核心页面 ==================
self.addEventListener('install', (e) => {
  console.log('[SW] install v11 (push enabled)');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[SW] cache.addAll partial fail:', err);
      });
    })
  );
  self.skipWaiting();
});

// ================== Activate: 清理旧缓存 ==================
self.addEventListener('activate', (e) => {
  console.log('[SW] activate v11');
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('xjb-') && k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ================== Fetch: Network-first, fallback to cache ==================
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Same-origin only
  if (url.origin !== location.origin) return;
  // 跳过 API 路由 (push-subscribe/push-send 由后端处理)
  if (url.pathname.startsWith('/api/')) return;
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return resp;
      })
      .catch(() => {
        return caches.match(e.request).then((cached) => {
          return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});

// ================== Push: 接收服务器推送 ==================
// event.data.json() 是后端 POST 来的 payload, 通常是 {title, body, icon, badge, url, data}
// 模式: web.dev/push-notifications-display  (event.waitUntil + Promise chain)
self.addEventListener('push', (event) => {
  console.log('[SW] push event received');

  let payload = {
    title: '🔔 新疆自驾 · 独库预警',
    body: '您有一条新的实时预警信息',
    icon: '/xjb-icon-192.png',
    badge: '/xjb-icon-192.png',
    url: '/视频库/live_info',
    data: {},
  };

  if (event.data) {
    try {
      const incoming = event.data.json();
      payload = Object.assign(payload, incoming);
    } catch (err) {
      console.warn('[SW] push payload parse fail, use text:', err);
      payload.body = event.data.text() || payload.body;
    }
  }

  const notificationOptions = {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    image: payload.image,
    data: Object.assign({ url: payload.url }, payload.data || {}),
    dir: 'auto',
    lang: 'zh-CN',
    tag: payload.tag || 'xjb-duku-alert',
    renotify: payload.renotify !== false,
    requireInteraction: payload.requireInteraction === true,
    vibrate: [200, 100, 200, 100, 200],
    timestamp: Date.now(),
    actions: payload.actions || [
      { action: 'open', title: '📖 查看详情', icon: '/xjb-icon-192.png' },
      { action: 'dismiss', title: '忽略' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

// ================== Notification Click: 打开 URL ==================
// event.notification.data.url 是后端传来的跳转链接
// 模式: clients.openWindow() + matchAll('window')
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] notification click', event.action);
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/视频库/live_info';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // 查找已有的同源窗口并聚焦
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if ('focus' in client) {
            // 把客户端 URL 路由到目标 URL (同源则 navigate, 跨域则 openWindow)
            try {
              const clientUrl = new URL(client.url);
              if (clientUrl.origin === self.location.origin) {
                return client.navigate(targetUrl).then(() => client.focus());
              }
            } catch (_) { /* ignore */ }
          }
        }
        // 没找到可用窗口, openWindow
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

// ================== Push Subscription Change: 处理过期/unsubscribe ==================
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] pushsubscriptionchange');
  event.waitUntil(
    self.registration.pushManager
      .subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY) })
      .then((sub) => {
        // 通知客户端重新 POST 给后端
        return fetch('/api/push-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub),
        });
      })
      .catch((err) => console.error('[SW] re-subscribe fail:', err))
  );
});

// ================== Helpers ==================
// 把 base64 VAPID 公钥转成 Uint8Array (PushManager.subscribe 需要的格式)
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

// 客户端可通过 postMessage 查询 VAPID key + 订阅状态
self.addEventListener('message', (event) => {
  if (!event.data || !event.data.type) return;

  if (event.data.type === 'GET_VAPID_KEY') {
    event.source && event.source.postMessage({ type: 'VAPID_KEY', key: VAPID_PUBLIC_KEY });
  }

  if (event.data.type === 'PING_SW') {
    event.source && event.source.postMessage({ type: 'PONG', version: CACHE_NAME });
  }
});