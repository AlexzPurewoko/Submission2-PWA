const CACHE_NAME = "football-v1";

const cachedUrls = [
    // added soon
    '/',
    '/index.html',
    
    // fonts
    '/fonts/MaterialIcons-Regular.eot',
    '/fonts/MaterialIcons-Regular.ttf',
    '/fonts/MaterialIcons-Regular.woff',
    '/fonts/MaterialIcons-Regular.woff2',

    // images
    //// errors
    '/images/errors/warning-error.svg',

    //// icons
    '/images/icons/icon-72x72.png',
    '/images/icons/icon-96x96.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-384x384.png',
    '/images/icons/icon-512x512.png',

    //// others
    '/images/others/nav-header.jpg',
    '/images/others/nav-icon.png',

    // manifest
    '/manifest/manifest.json',

    // scripts
    '/scripts/bundle-app.js'
];

function LOG(message){
    console.log(`SERVICE-WORKER: ${message}`);
}
self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            LOG('InstallEvent -> Done');
            return cache.addAll(cachedUrls);
        })
    )
});

self.addEventListener('activate', function(event){
    LOG('Activating Service Workers...');
    event.waitUntil(
        caches.keys().then(
            function(cacheNames) {
                return Promise.all(
                    cacheNames.map(
                        function(cacheName){
                            if(cacheName !== CACHE_NAME){
                                LOG(`Deleting cache ${cacheName}`);
                                return caches.delete(cacheName);
                            }
                        }
                    )
                );
            }
        )
    )
});

self.addEventListener("fetch", function(event){
    const baseUrl = "https://api.football-data.org";
    LOG(`FetchEvent => Has fired from ${event.request.url}`);

    // if loads from appshell
    if(!event.request.url.includes(baseUrl)){
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function(response) {
              return response || fetch (event.request);
            })
        );
        return;
    }
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function (response){
                const fetchPromise = fetch(event.request).then( function(netResponse){
                    if(response && netResponse.status === 200){
                        cache.delete(event.request).then(function(isDeleted){
                            if(isDeleted){
                                LOG(`FetchEvent => Old ${event.request.url} has been deleted and change to a new one`);
                                cache.put(event.request, netResponse.clone());
                            }
                        });
                    } else if(netResponse.status === 200){
                        LOG(`FetchEvent => Adding ${event.request.url} to cache`);
                        cache.put(event.request, netResponse.clone());
                    }
                    return netResponse;
                });
                return response || fetchPromise;
            })
        })
    )
});

self.addEventListener('push', function(event){
    var body;
    if(event.data){
        body = event.data.text();
    } else {
        body = 'No message in a payload. Maybe you missing it!';
    }

    var options = {
        body: body,
        icon: '/images/others/nav-icon.png',
        vibrate: [100,50,100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Football App', options)
    );
})
