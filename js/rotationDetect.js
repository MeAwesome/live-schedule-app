const userAgent = navigator.userAgent.toLowerCase();
const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);



function doOnOrientationChange() {
    var content = document.getElementById("contentHolder");
    var message = document.getElementById("rotationContainer");
  if((window.orientation == -90 || window.orientation == 90) && !isTablet && isMobile){
        content.style.display = "none";
        message.style.display = "table";
  } else {
    content.style.display = "block";
    message.style.display = "none";
  }

}

window.addEventListener('orientationchange', doOnOrientationChange);

doOnOrientationChange();
