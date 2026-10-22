/* TARKIZO service worker: the app works offline after the first visit.
   VERSION is replaced with the commit id by the deploy workflow, so every deploy refreshes the cache. */
const VERSION = 'tarkizo-dev';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/favicon.svg', './icons/icon-192.png', './icons/icon-512.png'];
const SOUNDS = 'tarkizo-sounds-v1';      // recordings never change, so they keep their own cache across versions
const FONTS = 'tarkizo-fonts-v1';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => ![VERSION, SOUNDS, FONTS].includes(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function cacheFirst(cacheName, req){
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
  return res;
}

async function networkFirst(req){
  const cache = await caches.open(VERSION);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    return (await cache.match(req)) || (await cache.match('./index.html')) || Response.error();
  }
}

async function staleWhileRevalidate(cacheName, req){
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const fresh = fetch(req).then(res => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; }).catch(() => hit);
  return hit || fresh;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (req.mode === 'navigate') return e.respondWith(networkFirst(req));
    if (url.pathname.includes('/sounds/')) return e.respondWith(cacheFirst(SOUNDS, req));
    return e.respondWith(staleWhileRevalidate(VERSION, req));
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    return e.respondWith(staleWhileRevalidate(FONTS, req));
  }
});
