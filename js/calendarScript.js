var calendarDayToPrint = 1;

function generateCalendar(){
	deleteCalendar();
	calTime.removeCustomDate();
	calTime.update();
	document.getElementById("cal-month").innerHTML = calTime.getDate().monthName + "<br>" + calTime.getDate().year;
	for(var w = 0; w < 5; w++){
		for(var d = 0; d < 7; d++){
			var wk = document.getElementById("cal-week-" + (w + 1));
			var dy = document.createElement("td");
			dy.setAttribute("class", "cal-days");
			if(w == 0 && d < calTime.getDate().firstDayOfMonth || calendarDayToPrint > monthlyLayout.length){
				dy.innerHTML = "";
				dy.setAttribute("class", "calendarOtherMonth");
			} else {
				dy.innerHTML = calendarDayToPrint;
				calTime.setCustomDate(calTime.getDate().month + 1 + "/" + calendarDayToPrint + "/" + calTime.getDate().year);
				calTime.update();
				var calSched = schedulesRequired[monthlyLayout[calTime.getDate().dayOfMonth - 1]].clone();
				var scheduleAvail = calSched.layout[0].periodNum;
				if(scheduleAvail != "Special Day"){
					dy.setAttribute("onclick", "displaySelectedSchedule(" + calendarDayToPrint + ")");
				} else {
					dy.setAttribute("class", "calendarNoSchool");
				}
				if(calendarDayToPrint == globalTime.getDate().dayOfMonth){
					dy.setAttribute("class", "calendarCurrentDay");
				}
				calendarDayToPrint++;
			}
			wk.appendChild(dy);
		}
	}
}

function deleteCalendar(){
	for(var w = 0; w < 5; w++){
		var wk = document.getElementById("cal-week-" + (w + 1));
		for(var d = 0; d < 7; d++){
			try{
				wk.children[0].remove();
			} catch {

			}
		}
	}
	calendarDayToPrint = 1;
}

function displaySelectedSchedule(day){
	globalTime.setCustomDate(globalTime.getDate().month + 1 + "/" + day + "/" + globalTime.getDate().year);
	globalTime.setCustomTime("12:00 a.m.");
	globalTime.update();
	createScheduleTable();
	display(1);
}
