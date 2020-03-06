function createScheduleTable(){
	deleteTable();
	if(currentSchedule.layout[0].periodNum == "Special Day"){
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
	var highlighted = false;





	for(var i = 0; i < currentSchedule.layout.length; i++){
		if(currentSchedule.layout[i].isPassing == false){
			var tableContainer = document.createElement("tr");
			var periodRow = document.createElement("td");
			var timeRow = document.createElement("td");
			var periodVal = document.createTextNode(currentSchedule.layout[i].tableDisplay.period);
			var timeVal = document.createTextNode(currentSchedule.layout[i].tableDisplay.time);
			periodRow.appendChild(periodVal);
			timeRow.appendChild(timeVal);
			var pass = false;
			try{
				if(currentSchedule.layout[currentSchedule.currentPeriod].isPassing){
					pass = currentSchedule.layout[currentSchedule.currentPeriod].periodNum;
				}
			} catch {

			}
			if ((i == currentSchedule.currentPeriod || currentSchedule.layout[i].periodNum == pass) && !highlighted){
				periodRow.setAttribute("class", "bellRow selected");
				timeRow.setAttribute("class", "bellRow selected");
				highlighted = true;
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

function deleteTable(){
	document.getElementById("tableToNotDelete").innerHTML = "";
	while(document.getElementsByClassName("bell-schedule-table").length > 0){
		document.getElementsByClassName("bell-schedule-table")[0].remove();
	}
}
