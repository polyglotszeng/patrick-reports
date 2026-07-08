// v4.1.5 SELF-DESTRUCT service worker.
// The browser checks this file for updates on every navigation, even when the old
// SW is serving stale HTML from cache. Installing this version unregisters the SW,
// wipes all caches, and force-reloads every open tab — after that the browser
// talks to the server directly, forever.
self.addEventListener("install", e => {
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then(clients => clients.forEach(c => c.navigate(c.url)))
  );
});
// No fetch handler: navigations go straight to network.
