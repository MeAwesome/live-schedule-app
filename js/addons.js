//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

window.onload = function(){
	showSection("");
	onLoadCheckTheme();
	onLoadCheckAnimation();
	onLoadCheckCircle();
	selectLunch();
}

function landOrPort(){
	if(window.matchMedia("(orientation: landscape)").matches){
		return "landscape";
	}
	return "portrait";
}

function isAppleDevice(){
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

function inStandalone(){
	 return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');
}

Array.prototype.pickValue = function(){
	var randomValue = Math.floor(Math.random()*this.length);
	return this[randomValue];
}

Array.prototype.occurs = function(value){
	var count = 0;
	for(var i = 0; i < this.length; i++){
		if(this[i] == value){
			count++;
		}
	}
	return count;
}

Array.prototype.pushAt = function(pos, value){
	this.splice(pos, 0, value);
}

String.prototype.contains = function(value){
	return this.indexOf(value) > -1;
}

String.prototype.occurs = function(value){
	var count = 0;
	var string = this;
	while(string.length > 0 && value != ""){
		if(string.substring(0, value.length) == value){
			count++;
		}
		string = string.slice(1);
	}
	return count;
}

String.prototype.indexOfNumber = function(){
	for(var i = 0; i < 10; i++){
		if(this.contains(i)){
			return this.indexOf(i);
		}
	}
	return -1;
}

String.prototype.indexesOf = function(value){
	var indexes = [];
	var string = this;
	while(string.length > 0 && value != ""){
		if(string.substring(0, value.length) == value){
			indexes.push(this.length - string.length);
		}
		string = string.slice(1);
	}
	return indexes;
}

Date.prototype.getWeek = function() {
  var d = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - d) / 86400000) + d.getDay()+1)/7) - 1;
}
