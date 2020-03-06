//Developed By: Isaac Robbins
//For Use With: HSE Schedule App

function DateTime(custom){
  this.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  this.time = false;
  this.date = false;
  this.staticTime = false;
  this.staticDate = false;

  if(custom != undefined){
    var formatter = new DateTime();
    if(custom.time != undefined){
      this.staticTime = formatter._formatStaticTime(custom.time);
    }
    if(custom.date != undefined){
      this.staticDate = formatter._formatStaticDate(custom.date);
    }
  }

  this.getTime = function(){
    return this.time;
  }

  this.getDate = function(){
    return this.date;
  }

  this.getTimeUntil = function(otherDateTime){
    return this._timeSubtraction(otherDateTime);
  }

  this.isBetween = function(firstDateTime, secondDateTime){
    return this._betweenTimes(firstDateTime, secondDateTime);
  }

  this.getTimeAsString = function(){
    return this._timeObjectToString(this.time);
  }

  this.getTimeInSeconds = function(){
    return this._toSeconds(this.time);
  }

  this.getDateAsString = function(){
    return this._dateObjectToString(this.date);
  }

  this.setCustomTime = function(time){
    this.staticTime = this._formatStaticTime(time);
  }

  this.setCustomDate = function(date){
    this.staticDate = this._formatStaticDate(date);
  }

  this.addMinutes = function(amount){
    var base = this._giveDateObject(this);
    base.setMinutes(base.getMinutes() + amount);
    this.setCustomTime(this._giveDateAsDateTime(base).time);
    this.setCustomDate(this._giveDateAsDateTime(base).date);
    this.update();
  }

  this.removeCustomTime = function(){
    this.staticTime = false;
  }

  this.removeCustomDate = function(){
    this.staticDate = false;
  }

  this.update = function(){
    var d = new Date();
    if(this.staticTime == false){
			this.time = {
				hour:d.getHours(),
				minute:d.getMinutes(),
				second:d.getSeconds(),
				millisecond:d.getMilliseconds()
			};
    } else {
      this.time = {
				hour:this.staticTime.hour,
				minute:this.staticTime.minute,
				second:this.staticTime.second,
				millisecond:this.staticTime.millisecond
			};
    }
    if(this.staticDate == false){
    	this.date = {
        year:d.getFullYear(),
    		month:d.getMonth(),
    		weekOfYear:d.getWeek(),
    		dayOfWeek:d.getDay(),
    		dayOfMonth:d.getDate(),
    		firstDayOfMonth:new Date(d.getFullYear(), d.getMonth(), 1).getDay(),
    		daysInMonth:new Date(d.getFullYear(), d.getMonth(), 0).getDate(),
    		monthName:this.monthNames[d.getMonth()],
    		dayName:this.dayNames[d.getDay()]
    	};
      var firstDayOfYear = Math.floor(new Date(d.getFullYear(), 0, 1) / 86400000);
      this.date.dayOfYear = Math.ceil((new Date(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000) - firstDayOfYear);
    } else {
      this.date = {
        year:this.staticDate.year,
    		month:this.staticDate.month,
    		weekOfYear:this.staticDate.weekOfYear,
    		dayOfWeek:this.staticDate.dayOfWeek,
    		dayOfMonth:this.staticDate.dayOfMonth,
        dayOfYear:this.staticDate.dayOfYear,
    		firstDayOfMonth:this.staticDate.firstDayOfMonth,
    		daysInMonth:this.staticDate.daysInMonth,
    		monthName:this.staticDate.monthName,
    		dayName:this.staticDate.dayName
    	};
    }
  }

  this._formatStaticTime = function(static){
    var d = new Date();
    if(typeof(static) == "string"){
      static = this._timeStringToObject(static);
    }
    if(static.hour == undefined){
      static.hour = d.getHours();
    }
    if(static.minute == undefined){
      static.minute = d.getMinutes();
    }
    if(static.second == undefined){
      static.second = d.getSeconds();
    }
    if(static.millisecond == undefined){
      static.millisecond = d.getMilliseconds();
    }
    return static;
  }

  this._formatStaticDate = function(static){
    var d = new Date();
    if(typeof(static) == "string"){
      static = this._dateStringToObject(static);
    }
    if(static.year == undefined){
      static.year = d.getFullYear();
    }
    if(static.month == undefined){
      static.month = d.getMonth();
    }
    if(static.dayOfMonth == undefined){
      static.dayOfMonth = new Date(static.year, static.month, d.getDate()).getDate();
    }
    if(static.dayOfWeek == undefined){
      static.dayOfWeek = new Date(static.year, static.month, static.dayOfMonth).getDay();
    }
    if(static.dayOfYear == undefined){
      var firstDayOfYear = Math.floor(new Date(static.year, 0, 1) / 86400000);
      static.dayOfYear = Math.ceil((new Date(static.year, static.month, static.dayOfMonth) / 86400000) - firstDayOfYear);
    }
    if(static.weekOfYear == undefined){
      static.weekOfYear = new Date(static.year, static.month, static.dayOfMonth).getWeek();
    }
    if(static.firstDayOfMonth == undefined){
      static.firstDayOfMonth = new Date(static.year, static.month, 1).getDay();
    }
    if(static.daysInMonth == undefined){
      static.daysInMonth = new Date(static.year, static.month, 0).getDate();
    }
    if(static.monthName == undefined){
      static.monthName = this.monthNames[static.month];
    }
    if(static.dayName == undefined){
      static.dayName = this.dayNames[static.dayOfWeek];
    }
    return static;
  }

  this._timeStringToObject = function(string){
    var object = {
      hour:undefined,
      minute:undefined,
      second:0,
      millisecond:0
    };
    if(string.contains("a.m.")){
      object.hour = parseInt(string.substring(0, string.indexOf(":")));
      object.minute = parseInt(string.substring(string.indexOf(":") + 1, string.indexOf("a.m.")));
      if(object.hour == 12){
        object.hour = 0;
      }
    } else if(string.contains("p.m.")){
      object.hour = parseInt(string.substring(0, string.indexOf(":")));
      object.minute = parseInt(string.substring(string.indexOf(":") + 1, string.indexOf("p.m.")));
      if(object.hour != 12){
        object.hour += 12;
      }
    }
    return object;
  }

  this._timeObjectToString = function(object){
    var string = "";
    var aOrP = "";
    var object = this._formatStaticTime(object);
    var minute = object.minute;
    if(object.hour < 12){
      if(object.hour == 0){
        string += (object.hour + 12);
      } else {
        string += object.hour;
      }
      aOrP = "a.m.";
    } else {
      if(object.hour == 12){
        string += object.hour;
      } else {
        string += (object.hour - 12);
      }
      aOrP = "p.m.";
    }
    if(minute < 10){
      minute = "0" + minute;
    }
    string += ":" + minute + " " + aOrP;
    return string;
  }

  this._dateStringToObject = function(string){
    var d = new Date();
    var object = {
      year:undefined,
      month:undefined,
      weekOfYear:undefined,
      dayOfWeek:undefined,
      dayOfMonth:undefined,
      firstDayOfMonth:undefined,
      daysInMonth:undefined,
      monthName:undefined,
      dayName:undefined
    };
    var divider = "";
    if(string.occurs("-") > 0){
      divider = "-";
    } else if(string.occurs("/") > 0){
      divider = "/";
    }
    if(string.occurs(divider) == 2){
      object.month = parseInt(string.substring(0, string.indexesOf(divider)[0])) - 1;
      object.dayOfMonth = parseInt(string.substring(string.indexesOf(divider)[0] + 1, string.indexesOf(divider)[1]));
      object.year = string.substring(string.indexesOf(divider)[1] + 1);
      if(object.year.length == 2){
        object.year = parseInt(d.getFullYear().toString().substring(0, 2) + object.year);
      } else {
        object.year = parseInt(object.year);
      }
    }
    return object;
  }

  this._dateObjectToString = function(obj){
    return obj.monthName + " " + obj.dayOfMonth + ", " + obj.year;
  }

  this._giveDateObject = function(dt){
    return new Date(dt.date.year, dt.date.month, dt.date.dayOfMonth, dt.time.hour, dt.time.minute, dt.time.second, dt.time.millisecond);
  }

  this._giveDateAsDateTime = function(date){
    var obj = {};
    obj.time = {
      hour:date.getHours(),
      minute:date.getMinutes(),
      second:date.getSeconds(),
      millisecond:date.getMilliseconds()
    };
    obj.date = {
      year:date.getFullYear(),
      month:date.getMonth(),
      weekOfYear:date.getWeek(),
      dayOfWeek:date.getDay(),
      dayOfMonth:date.getDate(),
      firstDayOfMonth:new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
      daysInMonth:new Date(date.getFullYear(), date.getMonth(), 0).getDate(),
      monthName:this.monthNames[date.getMonth()],
      dayName:this.dayNames[date.getDay()]
    };
    var firstDayOfYear = Math.floor(new Date(date.getFullYear(), 0, 1) / 86400000);
    obj.date.dayOfYear = Math.ceil((new Date(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000) - firstDayOfYear);
    return obj;
  }

  this._timeSubtraction = function(other){
    var remaining = {};
    var start = this._giveDateObject(this);
    var end = this._giveDateObject(other);
    var totalSeconds = (end - start) / 1000;
    remaining.millisecond = end.getTime() - start.getTime();
    remaining.second = Math.floor(remaining.millisecond / 1000) % 60;
    remaining.minute = Math.floor(remaining.millisecond / 1000 / 60) % 60;
    remaining.hour = Math.floor(remaining.millisecond / 1000 / 60 / 60) % 60;
    //remaining.day = Math.floor(remaining.hour / 1000 / 60 / 60 / 24);
    //remaining.week = Math.floor(remaining.day / 7);
    //remaining.month = 0;
    //remaining.year = 0;
    return remaining;
  }

  this._betweenTimes = function(first, second){
    var isBetween = false;
    var myself = this._giveDateObject(this);
    first = this._giveDateObject(first);
    second = this._giveDateObject(second);
    if(myself >= first && myself <= second){
      isBetween = true;
    }
    return isBetween;
  }

  this._toSeconds = function(time){
    var time = this._formatStaticTime(time);
		var seconds = time.second;
		seconds += time.minute * 60;
		seconds += time.hour * 3600;
		return seconds;
	}

  this.update();
}
