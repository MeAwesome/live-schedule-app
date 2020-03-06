//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

function Store(){
  this.exists = function(){
    if(typeof(Storage) == undefined){
      return false;
    }
    return true;
  }

  this.clear = function(){
    localStorage.clear();
  }

  this.remove = function(key){
    localStorage.removeItem(key);
  }

  this.set = function(key, value){
    localStorage[key] = value;
  }

  this.get = function(key){
    return localStorage[key];
  }

  this.getAllNames = function(){
    var attrs = [];
  	for(var attr in localStorage){
  		if(localStorage.hasOwnProperty(attr)){
  			attrs.push(attr);
  		}
  	}
  	return attrs;
  }
}
