importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '1' },
  { url: '/init.js', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  // Berkas package.json dan package-lock.json tidak perlu ditambahkan kedalam workbox.precaching ya karena berkas berkas tersebut bukan bagian dalam aplikasi kamu melainkan hanya sebagai depedency manager milik npm saja.
  // { url: '/package-lock.json', revision: '1' },
  // { url: '/package.json', revision: '1' },
  { url: '/team.html', revision: '1' },

  { url: '/css/main.css', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  
  { url: '/img/poy.gif', revision: '1' },
  { url: '/img/hiclipart.com.png', revision: '1' },
  { url: '/img/maskable_icon_1.png', revision: '1' },
  { url: '/img/maskable_icon_2.png', revision: '1' },
  { url: '/img/maskable_icon_3.png', revision: '1' },

  { url: '/img/android-icon-144x144.png', revision: '1' },
  { url: '/img/android-icon-192x192.png', revision: '1' },
  { url: '/img/android-icon-36x36.png', revision: '1' },
  { url: '/img/android-icon-48x48.png', revision: '1' },
  { url: '/img/android-icon-72x72.png', revision: '1' },
  { url: '/img/android-icon-96x96.png', revision: '1' },

  { url: '/img/apple-icon-114x114.png', revision: '1' },
  { url: '/img/apple-icon-120x120.png', revision: '1' },
  { url: '/img/apple-icon-144x144.png', revision: '1' },
  { url: '/img/apple-icon-152x152.png', revision: '1' },
  { url: '/img/apple-icon-180x180.png', revision: '1' },
  { url: '/img/apple-icon-57x57.png', revision: '1' },
  { url: '/img/apple-icon-60x60.png', revision: '1' },
  { url: '/img/apple-icon-72x72.png', revision: '1' },
  { url: '/img/apple-icon-76x76.png', revision: '1' },

  { url: '/img/ms-icon-144x144.png', revision: '1' },
  
  { url: '/img/favicon-16x16.png', revision: '1' },
  { url: '/img/favicon-32x32.png', revision: '1' },
  { url: '/img/favicon-96x96.png', revision: '1' },
  { url: '/img/favicon.ico', revision: '1' },

  { url: '/js/api.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/db.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  
  { url: '/pages/favorite.html', revision: '1' },
  { url: '/pages/standing.html', revision: '1' },
  { url: '/pages/templates/nav.html', revision: '1' },
], {
    ignoreURLParametersMatching: [/.*/],
});

workbox.routing.registerRoute(
  /\/pages\//g,
  workbox.strategies.staleWhileRevalidate({
      cacheName: 'pages-cache'
  })
);

workbox.routing.registerRoute(
  /\.(?:css|js|png|jpg|svg|gif)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'assets-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      })
    ]
  }),
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'data-cache',
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

self.addEventListener('push', function(event) {
  let body;

  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload!';
  }
  
  let options = {
    body: body,
    icon: 'img/maskable_icon_3.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});