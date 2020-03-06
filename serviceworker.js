const CACHE_NAME = "HSEScheduleAppCache";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/main.html",
  "/manifest.json",
  "/serviceworker.js",

  "/js/classes/DateTime.js",
  "/js/classes/Sheets.js",
  "/js/classes/Schedule.js",
  "/js/classes/PopUp.js",
  "/js/classes/Storage.js",

  "/js/main.js",
  "/js/ScriptPlus.js",
  "/js/pageSwitcher.js",
  "/js/scheduleTable.js",
  "/js/calendarScript.js",
  "/js/storageChecker.js",
  "/js/themeSwitcher.js",
  "/js/completionCircle.js",
  "/js/twitterFeed.js",

  "/styling/index.css",
  "/styling/style.css",
  "/styling/about.css",
  "/styling/bellSchedule.css",
  "/styling/home.css",
  "/styling/calendar.css",
  "/styling/settings.css",


  "/images/HSEScheduleAppLogo192.png",
  "/images/HSEScheduleAppLogo512.png",

  "/images/isaac.jpg",
  "/images/ethan.jpg",

  "/images/selected/about.png",
  "/images/selected/schedule.png",
  "/images/selected/home.png",
  "/images/selected/calendar.png",
  "/images/selected/settings.png",

  "/images/unselected/about.png",
  "/images/unselected/schedule.png",
  "/images/unselected/home.png",
  "/images/unselected/calendar.png",
  "/images/unselected/settings.png"
];

const publicKey = "BHV9vDKgZXPZH3S--ZPlDH4R4LQ636jvztTtYQppjrpVfJY3btRPzFhuvGY_xFrvpvCeAvMnJ7p3Vh2rykeaV54";

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/serviceworker.js")
      .then((reg) => {
        registration = reg;
      }).catch(function(err){

      });
  });
} else {

}

self.addEventListener("install", (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key != CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  if (evt.request.mode != "navigate") {
    return;
  }
  evt.respondWith(
      fetch(evt.request)
          .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                  return cache.match(evt.request);
                });
          })
  );
});
