const storage = new Store();

if(!storage.exists()){
  console.error("localStorage is not available on this device");
}

setStorageAttributes();
showLaunchScreen();

function setStorageAttributes(){
  if(storage.get("selectedLunch") == undefined){
    storage.set("selectedLunch", "UNCHOSEN");
  }
  if(storage.get("theme") == undefined){
    storage.set("theme", "light");
  }
  if(storage.get("popups") == undefined){
    storage.set("popups", "{}");
  }
  if(storage.get("animationState") == undefined){
    storage.set("animationState", false);
  }
  if(storage.get("showCircle") == undefined){
    storage.set("showCircle", true);
  }
  storage.getAllNames().forEach((name) => {
    if(name != "selectedLunch" && name != "theme" && name != "popups" && name != "animationState" && name != "showCircle"){
      storage.remove(name);
    }
  });
}

function showLaunchScreen(){
  if(storage.get("selectedLunch") == "UNCHOSEN"){
    if(window.location.pathname == "/" || window.location.pathname == "/main.html"){
      window.location.replace("/index.html");
    }
  } else {
    if(window.location.pathname == "/" || window.location.pathname == "/index.html"){
      window.location.replace("/main.html");
    }
  }
}

function setLunch(lunch){
  storage.set("selectedLunch", lunch);
  selectLunch();
}

function setAnimation(state){
  storage.set("animationState", state);
}

function getAnimation(){
  return localStorage.animationState;
}


function selectLunch(){
  removeSelectedLunch();
  var lunchElement;
  switch(storage.get("selectedLunch")){
    case "A":
      lunchElement = document.getElementById("aLunch");
      break;
    case "B":
      lunchElement = document.getElementById("bLunch");
      break;
    case "C":
      lunchElement = document.getElementById("cLunch");
      break;
    case "NONE":
      lunchElement = document.getElementById("noLunch");
      break;
    case "ALL":
      lunchElement = document.getElementById("allLunch");
      break;
  }
  lunchElement.classList.add("selectedLunch");
}

function removeSelectedLunch(){
  for(var i = 0; i < document.getElementsByClassName("selectedLunch").length; i++){
    document.getElementsByClassName("selectedLunch")[i].classList.remove("selectedLunch");
  }
}

function setTheme(theme){
  localStorage.theme = theme;
}

function getTheme(){
  return localStorage.theme;
}

function addPopId(id){
  var pop = JSON.parse(localStorage.popups);
  pop[id] = false;
  localStorage.popups = JSON.stringify(pop);
}

function popupSeen(id){
  var pop = JSON.parse(localStorage.popups);
  return pop[id];
}

function popupSetSeen(id){
  var pop = JSON.parse(localStorage.popups);
  pop[id] = true;
  localStorage.popups = JSON.stringify(pop);
}
