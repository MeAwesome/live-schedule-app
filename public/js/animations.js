function disableAnimations(){
    setAnimation(false);
  for(var i = 0; i < document.getElementsByClassName("pageContent").length; i++){
    document.getElementsByClassName("pageContent")[i].classList.remove("animation-wrapper");
  }

}

function enableAnimations(){
    setAnimation(true);
  for(var i = 0; i < document.getElementsByClassName("pageContent").length; i++){
    document.getElementsByClassName("pageContent")[i].classList.add("animation-wrapper");
  }

}



function onLoadCheckAnimation(){
    if(getAnimation() == "true"){
      document.getElementById("animationSlider").checked = true;
      enableAnimations();
    } else {
        document.getElementById("animationSlider").checked = false;
        disableAnimations();

}
}

function switchAnimations() {
if (document.getElementById("animationSlider").checked) {
    enableAnimations();
}
else {
  disableAnimations();
}
}
