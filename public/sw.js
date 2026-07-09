// Service Worker for PWA - Rune & Blade: Idle Online
const CACHE = 'rune-blade-v3-quests-drops'
const SCOPE_URL = new URL(self.registration.scope)
const APP_SHELL_URL = new URL('index.html', SCOPE_URL)
const ICON_URL = new URL('icon.svg', SCOPE_URL)
const PRECACHE_URLS = [
  SCOPE_URL.href,
  APP_SHELL_URL.href,
  new URL('manifest.json', SCOPE_URL).href,
  ICON_URL.href,
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match(APP_SHELL_URL.href)))
    return
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
})

self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {}
  e.waitUntil(
    self.registration.showNotification(d.title || '⚔️ Rune & Blade', {
      body:    d.body || 'มีเหตุการณ์ใหม่!',
      icon:    ICON_URL.href,
      tag:     d.tag  || 'rune-blade',
      data:    { url: SCOPE_URL.href },
    })
  )
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  if (e.action === 'dismiss') return
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
      const targetUrl = e.notification.data?.url || SCOPE_URL.href
      const c = cls.find(x => x.url.startsWith(SCOPE_URL.href))
      return c ? c.focus() : self.clients.openWindow(targetUrl)
    })
  )
})
