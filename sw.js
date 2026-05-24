// sw.js – Falapt service worker: caching + morning notifications
const CACHE = 'falapt-v1';
const URLS = [
  '/', '/index.html', '/style.css',
  '/js/store.js', '/js/srs.js', '/js/speech.js', '/js/xp.js',
  '/js/router.js', '/js/notifications.js', '/js/app.js',
  '/js/data/units.js',
  '/js/data/unit1-greetings.js', '/js/data/unit2-numbers.js',
  '/js/data/unit3-colors.js', '/js/data/unit4-family.js',
  '/js/data/unit5-time.js', '/js/data/unit6-verbs.js',
  '/js/data/unit7-food.js', '/js/data/unit8-places.js',
  '/js/data/unit9-shopping.js', '/js/data/unit10-conversations.js',
  '/js/views/home.js', '/js/views/lesson.js',
  '/js/views/flashcards.js', '/js/views/quiz.js',
  '/js/views/conversations.js', '/js/views/progress.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(URLS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Periodic background sync – fires once a day if browser supports it
self.addEventListener('periodicsync', e => {
  if (e.tag === 'morning-card') {
    e.waitUntil(tryMorningNotification());
  }
});

async function tryMorningNotification() {
  const h = new Date().getHours();
  if (h < 6 || h >= 12) return;

  const open = await clients.matchAll({ type: 'window', includeUncontrolled: true });
  if (open.some(c => c.visibilityState === 'visible')) return;

  return self.registration.showNotification('Falapt – Bom dia! 🇵🇹', {
    body: 'Your daily flashcard is waiting. Keep your streak alive!',
    tag: 'morning-card',
    requireInteraction: false,
    data: { url: '/' },
  });
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(cls => {
      if (cls.length) return cls[0].focus();
      return clients.openWindow(e.notification.data?.url || '/');
    })
  );
});
