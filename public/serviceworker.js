const CACHE_NAME = "HSEScheduleApp";

const FILES_TO_CACHE = [
  "/public/",
  "/public/index.html",
  "/public/main.html",
  "/public/manifest.json",
  "/public/serviceworker.js",

  "/public/js/classes/DateTime.js",
  "/public/js/classes/Sheets.js",
  "/public/js/classes/Schedule.js",
  "/public/js/classes/PopUp.js",
  "/public/js/classes/Storage.js",

  "/public/js/main.js",
  "/public/js/ScriptPlus.js",
  "/public/js/pageSwitcher.js",
  "/public/js/scheduleTable.js",
  "/public/js/calendarScript.js",
  "/public/js/storageChecker.js",
  "/public/js/themeSwitcher.js",
  "/public/js/completionCircle.js",
  "/public/js/twitterFeed.js",

  "/public/styling/index.css",
  "/public/styling/style.css",
  "/public/styling/about.css",
  "/public/styling/bellSchedule.css",
  "/public/styling/home.css",
  "/public/styling/calendar.css",
  "/public/styling/settings.css",


  "/public/images/HSEScheduleAppLogo192.png",
  "/public/images/HSEScheduleAppLogo512.png",

  "/public/images/isaac.jpg",
  "/public/images/ethan.jpg",

  "/public/images/selected/about.png",
  "/public/images/selected/schedule.png",
  "/public/images/selected/home.png",
  "/public/images/selected/calendar.png",
  "/public/images/selected/settings.png",

  "/public/images/unselected/about.png",
  "/public/images/unselected/schedule.png",
  "/public/images/unselected/home.png",
  "/public/images/unselected/calendar.png",
  "/public/images/unselected/settings.png"
];

const publicKey = "BHV9vDKgZXPZH3S--ZPlDH4R4LQ636jvztTtYQppjrpVfJY3btRPzFhuvGY_xFrvpvCeAvMnJ7p3Vh2rykeaV54";

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/public/serviceworker.js")
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
