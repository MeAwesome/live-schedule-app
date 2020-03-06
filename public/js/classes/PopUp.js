//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

var currentPopupDisplayed = undefined;
var popupWaitingList = [];

function PopUp(id){
  this.id= id;
  this.header = "Header";
  this.message = "Message";

  this.setHeader = function(header){
    this.header = header;
  }

  this.setMessage = function(message){
    this.message = message;
  }

  this.show = function(){
    if(currentPopupDisplayed == undefined){
      if(!(this.hasBeenSeen())){
        currentPopupDisplayed = this;
        document.getElementById("popup-header").innerHTML = this.header;
        document.getElementById("popup-message").innerHTML = this.message;
        document.getElementById("popup").setAttribute("class", "showDIV");
      }
    } else {
      popupWaitingList.push(this);
    }
  }

  this.setSeen = function(){
    var pop = JSON.parse(localStorage.popups);
    pop[this.id] = true;
    localStorage.popups = JSON.stringify(pop);
  }

  this.hasBeenSeen = function(){
    return JSON.parse(localStorage.popups)[this.id];
  }

  if(this.hasBeenSeen() == undefined){
    var pop = JSON.parse(localStorage.popups);
    pop[id] = false;
    localStorage.popups = JSON.stringify(pop);
  }
}

function hidePopup(){
  if(currentPopupDisplayed != undefined){
    currentPopupDisplayed.setSeen();
    currentPopupDisplayed = undefined;
    document.getElementById("popup").setAttribute("class", "hideDIV");
    if(popupWaitingList.length != 0){
      setTimeout(() => {
        popupWaitingList[0].show();
        popupWaitingList.shift();
      }, 1000);
    }
  }
}

window.ontouchstart = function(event){
  hidePopup();
}
window.onclick = function(event){
  hidePopup();
}
window.ontouch = function(event){
  hidePopup();
}
