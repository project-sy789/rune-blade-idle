// Service Worker for PWA — Rune & Blade: Idle Online
const CACHE = 'rune-blade-v1'

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['/', '/index.html']))
  )
  self.skipWaiting()
})

self.addEventListener('activate', () => self.clients.claim())

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')))
    return
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
})

self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {}
  e.waitUntil(
    self.registration.showNotification(d.title || '⚔️ Rune & Blade', {
      body:    d.body || 'มีเหตุการณ์ใหม่!',
      icon:    '/icon-192.png',
      tag:     d.tag  || 'rune-blade',
      data:    { url: '/' },
    })
  )
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  if (e.action === 'dismiss') return
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
      const c = cls.find(x => x.url.includes('/'))
      return c ? c.focus() : self.clients.openWindow('/')
    })
  )
})
