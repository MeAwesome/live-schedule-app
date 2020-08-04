//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

var timer = undefined;
var schedule = undefined;
var monthlySchedule = undefined;
var period = undefined;
var lunch = undefined;
var lunchPart = undefined;
var time = undefined;
var lunches = ["NONE", "A", "B", "C", "ALL"];

function setup(){
  showSection();
  document.getElementById("timeHeader").textContent = "Connected";
  document.getElementById("timeText").textContent = "Loading";
  document.getElementById("dateAndTime").style.display = "block";
  if(isAppleDevice() && !inStandalone()){
    var appleInstallPop = new PopUp("apple-installer");
    appleInstallPop.setHeader("Install On iOS");
    appleInstallPop.setMessage("1. Click the 'share' icon at the bottom of the screen.<br><br>2. Click 'Add to Home Screen'<br><br>3. Click 'Add'");
    appleInstallPop.show();
  }
  var migrate = new PopUp("Heroku Migration");
  migrate.setHeader("We've Moved!");
  migrate.setMessage("Our new website is<br><br>hseschedule.herokuapp.com");
  migrate.show();
  var recentUpdate = new PopUp("Update V. 2.0.0");
  recentUpdate.setHeader("Version 2.0.0");
  recentUpdate.setMessage("-Moved From Netlify To Heroku<br><br>-Times Synchronized Across All Devices<br><br>-Performance Improvements");
  recentUpdate.show();
}

function updateTimers(t){
  var timeLeft = "";
  var time;
  if(lunch != undefined){
    time = t.period[storage.get("selectedLunch").toLowerCase()];
  } else {
    time = t.period;
  }
  if(time.hours != 0){
    timeLeft += time.hours + ":";
  }
  if(time.minutes < 10 && time.hours != 0){
    timeLeft += "0" + time.minutes + ":";
  } else {
    timeLeft += time.minutes + ":";
  }
  if(time.seconds < 10){
    timeLeft += "0" + time.seconds;
  } else {
    timeLeft += time.seconds;
  }
  document.getElementById("timeText").textContent = timeLeft;
  if(t.lunch != undefined && storage.get("selectedLunch") != "NONE" && lunches.indexOf(lunch) < lunches.indexOf(storage.get("selectedLunch"))){
    var timeLeft = "";
    var time = t.lunch[storage.get("selectedLunch").toLowerCase()];
    if(time.hours != 0){
      timeLeft += time.hours + ":";
    }
    if(time.minutes < 10 && time.hours != 0){
      timeLeft += "0" + time.minutes + ":";
    } else {
      timeLeft += time.minutes + ":";
    }
    if(time.seconds < 10){
      timeLeft += "0" + time.seconds;
    } else {
      timeLeft += time.seconds;
    }
    document.getElementById("lunchText").textContent = "Time Until Lunch";
    document.getElementById("lunchTime").textContent = timeLeft;
    document.getElementById("lunch").style.display = "table-cell";
  } else {
    document.getElementById("lunch").style.display = "none";
  }
}

function handleScheduleData(s, p){
  if(s != undefined){
    switch(s.metadata.type){
      case "school day":
        if(p != undefined){
          if(p == "Before School"){
            document.getElementById("timeHeader").textContent = "School Starts In";
            document.getElementById("timeSecondaryHeader").style.display = "none";
          } else if(p == "After School"){
            document.getElementById("timeHeader").textContent = "School Has Ended";
            document.getElementById("timeText").textContent = "School Day Over";
            document.getElementById("timeSecondaryHeader").style.display = "none";
          } else {
            if(p.type == "class"){
              document.getElementById("timeHeader").textContent = p.periodName;
              document.getElementById("timeSecondaryHeader").style.display = "none";
            } else if(p.type == "passing"){
              document.getElementById("timeHeader").textContent = "Passing Period";
              document.getElementById("timeSecondaryHeader").textContent = "Go To " + period.to;
              document.getElementById("timeSecondaryHeader").style.display = "block";
            } else if(p.type == "lunches"){
              if(lunchPart[storage.get("selectedLunch").toLowerCase()] != undefined && lunchPart[storage.get("selectedLunch").toLowerCase()].type == "lunch"){
                document.getElementById("timeSecondaryHeader").style.display = "none";
                document.getElementById("timeHeader").textContent = lunchPart[storage.get("selectedLunch").toLowerCase()].lunchName;
              } else if(lunchPart[storage.get("selectedLunch").toLowerCase()] != undefined && lunchPart[storage.get("selectedLunch").toLowerCase()].type == "passing"){
                document.getElementById("timeHeader").textContent = "Passing Period";
                document.getElementById("timeSecondaryHeader").textContent = "Go To " + lunchPart[storage.get("selectedLunch").toLowerCase()].to;
                document.getElementById("timeSecondaryHeader").style.display = "block";
              } else {
                document.getElementById("timeSecondaryHeader").style.display = "none";
                document.getElementById("timeHeader").textContent = p.periodName;
              }
            }
          }
          break;
        }
      case "weekend":
        document.getElementById("timeHeader").textContent = "It's The Weekend";
        document.getElementById("timeText").textContent = "No School Today";
        document.getElementById("timeSecondaryHeader").style.display = "none";
        break;
      case "break":
        document.getElementById("timeHeader").textContent = s.metadata.name;
        document.getElementById("timeText").textContent = "No School Today";
        document.getElementById("timeSecondaryHeader").style.display = "none";
        break;
      default:
        document.getElementById("timeHeader").textContent = "An Error Occured";
        document.getElementById("timeText").textContent = "Unavailable";
        document.getElementById("timeSecondaryHeader").style.display = "none";
        break;
    }
  }
}

function updateClock(dayName, week, time){
  document.getElementById("currentDayText").textContent = dayName;
  document.getElementById("currentWeekText").textContent = week;
  document.getElementById("currentTimeText").textContent = time;
}

function bindSocketEvents(){
  socket.on("CONNETED_TO_SERVER", () => {
    setup();
  });

  socket.on("GET_USER_ID", () => {
    socket.emit("USER_ID", storage.get("userId"));
  });

  socket.on("SET_USER_ID", (id) => {
    storage.set("userId", id);
  });

  socket.on("SERVER_READY", () => {

    //socket.emit("LUNCH_CHANGE", storage.get("selectedLunch"));
    socket.emit("REQUEST_SCHEDULE");

    socket.on("SCHEDULE_DATA", (data) => {
      schedule = data.today;
      monthlySchedule = data.monthly
      handleScheduleData(schedule, period);
      createScheduleTable(schedule);
      generateCalendar(monthlySchedule);
    });

    socket.on("TIME_DATA", (data) => {
      timer = data.timer;
      if(data.period != period){
        createScheduleTable(schedule);
      }
      period = data.period;
      lunch = data.lunch;
      lunchPart = data.lunchPart;
      time = data.time;
      if(timer != undefined){
        updateTimers(timer);
      }
      updateClock(time.day, time.week, time.time);
      handleScheduleData(schedule, period);
    });

    socket.on("disconnect", () => {
      document.getElementById("timeHeader").textContent = "Disconnected";
      document.getElementById("timeText").textContent = "Retrying";
      document.getElementById("dateAndTime").style.display = "none";
      document.getElementById("lunch").style.display = "none";
      deleteTable();
      deleteCalendar();
    });

  });

}

window.onload = function(){
  socket = io();
  bindSocketEvents();
  onLoadCheckTheme();
  onLoadCheckAnimation();
  onLoadCheckCircle();
  document.getElementById("popup").ontouchstart = function(event){
    hidePopup();
  }
  document.getElementById("popup").onclick = function(event){
    hidePopup();
  }
  document.getElementById("popup").ontouch = function(event){
    hidePopup();
  }
}

window.onfocus = function(){
  socket.connect();
  socket.emit("REQUEST_SCHEDULE");
}

var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange(){
  if(document[hidden]){
    socket.disconnect();
  } else {
    socket.connect();
    socket.emit("REQUEST_SCHEDULE");
  }
}

if(typeof document.addEventListener == "undefined" || hidden == undefined){
  console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} else {
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}
