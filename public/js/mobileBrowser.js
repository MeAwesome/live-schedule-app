var mobileWindow = document.getElementsByClassName("homeContent")[0];
// var tableHeight = document.getElementsByClassName("tg")[0];


changeHeight();
function changeHeight(){

  if(window.innerHeight > window.innerWidth){
    //
    // console.log(monthlyRawData.getRows());
    document.getElementById("bellScheduleTable").style.lineHeight = window.innerHeight / 20 + "px";
  var innerSize = window.innerHeight;
  mobileWindow.style.height = innerSize * .81 +  "px";
  mobileWindow.style.paddingTop = innerSize * .02 + "px";
  mobileWindow.style.paddingBottom = innerSize * .04 + "px";
  mobileWindow.style.fontSize = innerSize * .025 + "px";
  // for(var i = 0; i < document.getElementsByClassName("tg").length; i++){
  //   document.getElementsByClassName("tg")[i].style.fontSize = 20 + "vh";
  // }
} else {
  document.getElementById("bellScheduleTable").style.lineHeight = window.innerHeight / 20 + "px";
    var innerSize = window.innerHeight;
  mobileWindow.style.height = innerSize * .81 +  "px";
}
}



window.addEventListener("resize", changeHeight);
