/* Citta Comida — service worker */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch {}
  const title = data.title || "Citta Comida";
  e.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "Something fresh just came out of the oven",
      icon: "/apple-icon.png",
      badge: "/apple-icon.png",
      tag: data.tag || "cc",
      renotify: true,
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (new URL(c.url).pathname === url && "focus" in c) return c.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
