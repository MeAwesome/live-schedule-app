var mobileWindow = document.getElementsByClassName("homeContent")[0];

changeHeight();

function changeHeight() {

  if (window.innerHeight > window.innerWidth) {
    var innerSize = window.innerHeight;
    document.getElementById("bellScheduleTable").style.lineHeight = innerSize / 20 + "px";
    document.getElementById("about").style.height = innerSize * .81 + "px";
    document.getElementsByClassName("calContent")[0].style.height = innerSize * .81 + "px";
    mobileWindow.style.height = innerSize * .81 + "px";
    mobileWindow.style.paddingTop = innerSize * .02 + "px";
    mobileWindow.style.paddingBottom = innerSize * .04 + "px";
    mobileWindow.style.fontSize = innerSize * .025 + "px";
  } else {
    document.getElementById("bellScheduleTable").style.lineHeight = window.innerHeight / 20 + "px";
    var innerSize = window.innerHeight;
    document.getElementById("about").style.height = innerSize * .81 + "px";
    mobileWindow.style.height = innerSize * .81 + "px";
  }
}

function orientationChanged() {
  const timeout = 120;
  return new window.Promise(function(resolve) {
    const go = (i, height0) => {
      window.innerHeight != height0 || i >= timeout ?
        resolve() :
        window.requestAnimationFrame(() => go(i + 1, height0));
    };
    go(0, window.innerHeight);
  });
}


window.addEventListener('orientationchange', function() {
  orientationChanged().then(function() {
    changeHeight();
  });
});