function createScheduleTable(s){
  if(s == undefined){
    return;
  }
  deleteTable();
  document.getElementById("bellDayVal").innerHTML = s.metadata.name;
  if(s.metadata.type != "school day"){
    noSchoolTable();
    return;
  }
  var tableHeader = document.getElementById("tableToNotDelete");
  var periodHeader = document.createElement("td");
  var periodText = document.createTextNode("Period");
  periodHeader.appendChild(periodText);
  periodHeader.setAttribute("class", "bellRow");
  tableHeader.appendChild(periodHeader);
  var timeHeader = document.createElement("td");
  var timeText = document.createTextNode("Time");
  timeHeader.appendChild(timeText);
  timeHeader.setAttribute("class", "bellRow");
  tableHeader.appendChild(timeHeader);
  for(var i = 0; i < s.schedule.length; i++){
    if(s.schedule[i].type != "passing"){
      var startTime = moment().set({"hour":s.schedule[i].startTime.hour, "minute":s.schedule[i].startTime.minute}).format("h:mm");
      var endTime = moment().set({"hour":s.schedule[i].endTime.hour, "minute":s.schedule[i].endTime.minute}).format("h:mm");
      var tableContainer = document.createElement("tr");
      var periodRow = document.createElement("td");
      var timeRow = document.createElement("td");
      var periodVal = document.createTextNode(s.schedule[i].period);
      var timeVal = document.createTextNode(startTime + " - " + endTime);
      periodRow.appendChild(periodVal);
      timeRow.appendChild(timeVal);
      if(period != undefined && s.schedule[i].period == period.period){
        periodRow.setAttribute("class", "bellRow selected");
        timeRow.setAttribute("class", "bellRow selected");
      } else {
        periodRow.setAttribute("class", "bellRow");
        timeRow.setAttribute("class", "bellRow");
      }
      tableContainer.setAttribute("class", "bell-schedule-table");
      tableContainer.appendChild(periodRow);
      tableContainer.appendChild(timeRow);
      var table = document.getElementsByTagName("table")[0];
      table.appendChild(tableContainer);
    }
  }
}

function noSchoolTable() {
  var noSchool = document.createElement("h2");
  var headerVal = document.createTextNode("No School Today");
  noSchool.appendChild(headerVal);
  noSchool.setAttribute("class", "noSchool");
  var tableHeader = document.getElementById("tableToNotDelete");
  tableHeader.appendChild(noSchool);
}

function deleteTable() {
  document.getElementById("tableToNotDelete").innerHTML = "";
  document.getElementById("bellDayVal").innerHTML = "";
  while (document.getElementsByClassName("bell-schedule-table").length > 0) {
    document.getElementsByClassName("bell-schedule-table")[0].remove();
  }
}
