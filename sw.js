// Offline shell: network first, fall back to the cached copy. Data calls (POST to Apps Script) are never cached.
var CACHE = 'dw-5b85861206';
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(function (res) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); return res; })
    .catch(function () { return caches.match(r).then(function (m) { return m || caches.match('index.html'); }); }));
});
