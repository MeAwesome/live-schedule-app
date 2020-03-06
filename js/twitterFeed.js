var screenHeight = window.screen.height;
var screenWidth = window.screen.width;

var vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

if(vh >= vw){
  vh *= 0.6;
} else {
  vh *= 0.7;
}


var twitterElem = document.getElementById("twitter");
var twitterFeed = document.createElement("a");
twitterFeed.setAttribute("class", "twitter-timeline");
twitterFeed.setAttribute("data-lang", "en");
twitterFeed.setAttribute("data-width", vw.toString());
twitterFeed.setAttribute("data-height", vh.toString());

twitterFeed.setAttribute("data-theme", "dark");
twitterFeed.setAttribute("href", "https://twitter.com/HSESchools?ref_src=twsrc%5Etfw");
twitterElem.appendChild(twitterFeed);

function showCredits(){
  var credits = document.getElementById("credits");
  var twitterToHide = document.getElementById("twitter");
  var linksToHide = document.getElementById("links");
  var backButton = document.getElementById("backButton");
  backButton.style.display = "block";
  linksToHide.style.display = "none";
  twitterToHide.style.display = "none";
  credits.style.display = "block";
}

function showTwitter(){
  var credits = document.getElementById("credits");
  var twitterToHide = document.getElementById("twitter");
  var linksToHide = document.getElementById("links");
  var backButton = document.getElementById("backButton");
  backButton.style.display = "none";
  linksToHide.style.display = "block";
  twitterToHide.style.display = "block";
  credits.style.display = "none";
}

function creditsReset(){
  var credits = document.getElementById("credits");
  var twitterToHide = document.getElementById("twitter");
  var linksToHide = document.getElementById("links");
  var backButton = document.getElementById("backButton");
  backButton.style.display = "none";
  linksToHide.style.display = "block";
  twitterToHide.style.display = "block";
  credits.style.display = "block";
}

var mql = window.matchMedia("(orientation: portrait)");


mql.addListener(function(m) {
	if(m.matches) {
		showTwitter();
	}
	else {
    creditsReset();
	}
});

function resizeTwitter(){
  try{
    var feed = document.getElementById("twitter-widget-0");
    var vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    feed.style.width = vw.toString();
    feed.style.height = vh.toString();
  } catch {
    
  }
}
