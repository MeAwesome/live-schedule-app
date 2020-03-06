//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

const googleSheetURL = "https://docs.google.com/spreadsheets/d/1QBUjDIa7H-UhTKOe7znd2h9XYn1uDeuZrXzuR0C7KYk/gviz/tq?sheet=";

const globalTime = new DateTime();
const calTime = new DateTime();
const monthlyRawData = new Sheet(googleSheetURL);
const schedules = new Schedules(globalTime.getDate().monthName);
var firstLoadedSchedules = undefined;
var monthlyLayout = undefined;
var schedulesRequired = undefined;
var currentSchedule = undefined;
var personalSchedule = undefined;
var periodTimeLeft = undefined;
var periodHeader = undefined;
var periodShowLower = undefined;
var showLunch = undefined;
var tickCount = 0;

preupdate();

async function preupdate(){
  await loadGoogleCharts();
  await refreshSchedules();
  update();
  generateCalendar();
  setTimeout(refreshSchedules, 10000);
  if(isAppleDevice() && !inStandalone()){
    var appleInstallPop = new PopUp("apple-installer");
    appleInstallPop.setHeader("Install On iOS");
    appleInstallPop.setMessage("1. Click the 'share' icon at the bottom of the screen.<br><br>2. Click 'Add to Home Screen'<br><br>3. Click 'Add'");
    appleInstallPop.show();
  }
  var recentUpdate = new PopUp("Update V. 1.0.4");
  recentUpdate.setHeader("Version 1.0.4");
  recentUpdate.setMessage("-Swipe Between Pages<br><br>-Styling Changes<br><br>-Toggle Completion Circle");
  recentUpdate.show();
}

function update(){
  globalTime.update();
  try{
    currentSchedule = schedulesRequired[monthlyLayout[globalTime.getDate().dayOfMonth - 1]].clone();
    personalSchedule = schedulesRequired[monthlyLayout[globalTime.getDate().dayOfMonth - 1]].clone();
    currentSchedule.updateTimes();
    personalSchedule.updateTimes();
  } catch {
    currentSchedule = schedulesRequired[monthlyLayout[0]].clone();
    personalSchedule = schedulesRequired[monthlyLayout[0]].clone();
    currentSchedule.removeCustomDates();
    personalSchedule.removeCustomDates();
  }
  personalizeSchedule();
  setCurrentPeriod(currentSchedule);
  setCurrentPeriod(personalSchedule);
  periodHeader = getPeriodHeader();
  periodTimeLeft = getPeriodTimeLeft();
  getCanvas();
  updateDisplays();
  try{
    completeCircle(1 - globalTime._toSeconds(globalTime.getTimeUntil(personalSchedule.layout[personalSchedule.currentPeriod].endTime)) / globalTime._toSeconds(personalSchedule.layout[personalSchedule.currentPeriod].startTime.getTimeUntil(personalSchedule.layout[personalSchedule.currentPeriod].endTime)));
  } catch {
    clearCircle();
  }
  resizeTwitter();
  if(tickCount == 0){
    createScheduleTable();
  }
  tickCount = (tickCount + 1) % 60;
  window.requestAnimationFrame(update);
}

async function refreshSchedules(){
  await monthlyRawData.getRawData();
  await schedules.setSchedules(googleSheetURL, monthlyRawData.rawData);
  monthlyLayout = schedules.getScheduleLayout();
  schedulesRequired = schedules.getRequiredSchedules();
  if(firstLoadedSchedules == undefined){
    firstLoadedSchedules = schedules.clone();
  }
  if(!(schedules.isEqualTo(firstLoadedSchedules))){
    window.location.reload();
  }
  setTimeout(refreshSchedules, 10000);
}

function personalizeSchedule(){
  var lunchIndexes = [];
  for(var p = 0; p < personalSchedule.layout.length; p++){
    if(personalSchedule.layout[p].isLunch){
      lunchIndexes.push(p);
    }
  }
  if(lunchIndexes.length > 0){
    var start = personalSchedule.layout[lunchIndexes[0]];
    var middle = personalSchedule.layout[lunchIndexes[1]];
    var end = personalSchedule.layout[lunchIndexes[2]];
    var pass = new PassingPeriod();
    var pass2 = new PassingPeriod();
    for(var l = 0; l < lunchIndexes.length; l++){
      if(personalSchedule.layout[lunchIndexes[l]].lunchName != undefined && personalSchedule.layout[lunchIndexes[l]].lunchName.contains(localStorage.selectedLunch)){
        switch(l){
          case 0:
            start.setDisplayName(start.lunchName);
            middle.startTime.addMinutes(7);
            middle.setDisplayName(start.notLunchName);
            middle.setTimes(middle.startTime.getTimeAsString(), end.endTime.getTimeAsString());
            personalSchedule.layout.splice(lunchIndexes[2], 1);
            personalSchedule.lunchPeriod = lunchIndexes[0];
            pass.setDisplayName("Passing Period");
            pass.setLowerDisplayName("(Go To " + middle.notLunchName + ")");
            pass.setPeriodNumber(middle.periodNum);
            pass.setTimes(start.endTime.getTimeAsString(), middle.startTime.getTimeAsString());
            personalSchedule.layout.pushAt(lunchIndexes[1], pass);
            break;
          case 1:
            start.setDisplayName(start.notLunchName);
            middle.setDisplayName(middle.lunchName);
            end.setDisplayName(end.notLunchName);
            personalSchedule.lunchPeriod = lunchIndexes[2];
            var beforeChange = start.startTime.getTimeAsString();
            start.startTime.addMinutes(7);
            pass.setDisplayName("Passing Period");
            pass.setLowerDisplayName("(Go To " + start.notLunchName + ")");
            pass.setPeriodNumber(start.periodNum);
            pass.setTimes(beforeChange, start.startTime.getTimeAsString());
            end.startTime.addMinutes(5);
            pass2.setDisplayName("Passing Period");
            pass2.setLowerDisplayName("(Go To " + end.notLunchName + ")");
            pass2.setPeriodNumber(end.periodNum);
            pass2.setTimes(middle.endTime.getTimeAsString(), end.startTime.getTimeAsString());
            personalSchedule.layout.pushAt(lunchIndexes[0], pass);
            personalSchedule.layout.pushAt(lunchIndexes[2] + 1, pass2);
            break;
          case 2:
            start.setDisplayName(start.notLunchName);
            end.setDisplayName(end.lunchName);
            start.setTimes(start.startTime.getTimeAsString(), middle.endTime.getTimeAsString());
            personalSchedule.layout.splice(lunchIndexes[1], 1);
            personalSchedule.lunchPeriod = lunchIndexes[2];
            var beforeChange = start.startTime.getTimeAsString();
            start.startTime.addMinutes(7);
            pass.setDisplayName("Passing Period");
            pass.setLowerDisplayName("(Go To " + start.notLunchName + ")");
            pass.setPeriodNumber(start.periodNum);
            pass.setTimes(beforeChange, start.startTime.getTimeAsString());
            personalSchedule.layout.pushAt(lunchIndexes[0], pass);
            break;
        }
        return;
      } else if(localStorage.selectedLunch == "NONE"){
        start.setDisplayName(start.notLunchName);
        start.setTimes(start.startTime.getTimeAsString(), end.endTime.getTimeAsString());
        personalSchedule.layout.splice(lunchIndexes[1], 2);
        personalSchedule.lunchPeriod = "NONE";
        return;
      } else if(localStorage.selectedLunch == "ALL"){
        start.setDisplayName(start.lunchName);
        middle.setDisplayName(middle.lunchName);
        end.setDisplayName(end.lunchName);
        personalSchedule.lunchPeriod = lunchIndexes[0];
        return;
      }
    }
  }
}

function setCurrentPeriod(schedule){
  periodShowLower = true;
  showLunch = true;
  if(globalTime.getTimeInSeconds() <= schedule.schoolStartTime.getTimeInSeconds()){
    schedule.currentPeriod = "Before School";
    periodShowLower = false;
    showLunch = true;
    return;
  }
  if(globalTime.getTimeInSeconds() >= schedule.schoolEndTime.getTimeInSeconds()){
    schedule.currentPeriod = "After School";
    periodShowLower = false;
    showLunch = false;
    return;
  }
  for(var p = 0; p < schedule.layout.length; p++){
    if(globalTime.isBetween(schedule.layout[p].startTime, schedule.layout[p].endTime)){
      schedule.currentPeriod = p;
      return;
    }
  }
  if(schedule.layout[0].periodNum == "Special Day"){
    schedule.currentPeriod = 0;
    showLunch = false;
    if(schedule.layout[0].lowerDisplayName == false){
      periodShowLower = false;
    } else {
      periodShowLower = true;
    }
    return;
  }
  return;
}

function getPeriodHeader(){
  if(personalSchedule.currentPeriod == undefined){
    return "Header";
  } else if(personalSchedule.currentPeriod == "Before School"){
    return "School Starts In";
  } else if(personalSchedule.currentPeriod == "After School"){
    return "School Has Ended";
  } else {
    return personalSchedule.layout[personalSchedule.currentPeriod].displayName;
  }
}

function getPeriodTimeLeft(){
  if(personalSchedule.currentPeriod == undefined){
    return "Time";
  } else if(personalSchedule.currentPeriod == "Before School"){
    return formatTimeLeft(globalTime.getTimeUntil(personalSchedule.schoolStartTime));
  } else if(personalSchedule.currentPeriod == "After School"){
    return "No Time Available";
  } else if(personalSchedule.layout[0].periodNum == "Special Day"){
    return personalSchedule.layout[0].customPeriodTime;
  } else {
    return formatTimeLeft(globalTime.getTimeUntil(personalSchedule.layout[personalSchedule.currentPeriod].endTime));
  }
}

function formatTimeLeft(obj){
  var string = "";
  if(obj.hour != 0){
    string += obj.hour + ":";
    if(obj.minute < 10){
      string += "0";
    }
  }
  string += obj.minute + ":";
  if(obj.second < 10){
    string += "0" + obj.second;
  } else {
    string += obj.second;
  }
  return string;
}

function updateDisplays(){
  document.getElementById("currentDayText").textContent = globalTime.getDate().dayName;
  document.getElementById("currentWeekText").textContent = globalTime.getDateAsString();
  document.getElementById("currentTimeText").textContent = globalTime.getTimeAsString();
  document.getElementById("timeHeader").textContent = periodHeader;
  document.getElementById("timeText").textContent = periodTimeLeft;
  if(periodShowLower && personalSchedule.layout[personalSchedule.currentPeriod] != undefined && personalSchedule.layout[personalSchedule.currentPeriod].lowerDisplayName != false){
    document.getElementById("timeSecondaryHeader").textContent = personalSchedule.layout[personalSchedule.currentPeriod].lowerDisplayName;
    document.getElementById("timeSecondaryHeader").style.display = "block";
  } else {
    document.getElementById("timeSecondaryHeader").style.display = "none";
  }
  try{
    if(showLunch && globalTime.getTimeInSeconds() < personalSchedule.layout[personalSchedule.lunchPeriod].startTime.getTimeInSeconds()){
      document.getElementById("lunchText").textContent = "Time Until " + personalSchedule.layout[personalSchedule.lunchPeriod].lunchName;
      document.getElementById("lunchTime").textContent = formatTimeLeft(globalTime.getTimeUntil(personalSchedule.layout[personalSchedule.lunchPeriod].startTime));
      document.getElementById("lunch").style.display = "table-cell";
    } else {
      document.getElementById("lunch").style.display = "none";
    }
  } catch {
    document.getElementById("lunch").style.display = "none";
  }
}
