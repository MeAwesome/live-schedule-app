var express = require("express");
var os = require("os");
var moment = require("moment");
var app = express();
var serv = require("http").Server(app);
var io = require("socket.io")(serv,{});
var port = process.env.PORT || 51000;
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis').google;
app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/index.html");
});
app.use("/public", express.static(__dirname + "/public"));
serv.listen(port);
if(port != process.env.PORT){
		__ConnectTo__ = os.networkInterfaces()["Wi-Fi"][1].address + ":" + port || os.networkInterfaces()["Ethernet"][1].address + ":" + port;
	console.clear();
	console.log("--> Webpage Started On } " + __ConnectTo__);
}



var connections = {};
var refreshFrequency = 5; //Fastest Value is 5
var scheduleLayout = [];
var schedules = [];
var lastSecond = moment().get("second");

io.on("connection", function(socket){

	connections[socket.id] = new Connection(socket);

	socket.emit("connected_to_server");

	socket.emit("layout_data", scheduleLayout);

	socket.on("disconnect", () => {
		delete connections[socket.id];
	});

});

function Connection(socket){
	this.socket = socket;
	this.socketId = socket.id;
}

function sendScheduleLayout(){
	io.emit("layout_data", scheduleLayout);
}

function sendTime(){
	if(moment().get("second") != lastSecond){
		lastSecond = moment().get("second");
		io.emit("current_time", {
			hour:moment().get("hour"),
			minute:moment().get("minute"),
			second:moment().get("second")
		});
	}
}

function runner(auth){
	sheets = google.sheets({version: 'v4', auth});
	ticks = 0;
	miniTicks = 0;
	setInterval(async() => {
		if(ticks == 0){
			var mostRecent = await getLayout("Monthly Planner");
			if(!arraysEqual(scheduleLayout, mostRecent)){
				scheduleLayout = mostRecent;
				sendScheduleLayout();
			}
			if(miniTicks == 0){

			}
			miniTicks = (miniTicks + 1) % (refreshFrequency * 5);
		}
		sendTime();
		ticks = (ticks + 1) % (refreshFrequency * 10);
	}, 100);
}

function arraysEqual(a1,a2){
	return JSON.stringify(a1) == JSON.stringify(a2);
}





const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), runner);
});

function authorize(credentials, callback) {
  const client_secret = credentials.installed.client_secret;
	const client_id = credentials.installed.client_id;
	const redirect_uris = credentials.installed.redirect_uris;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
	});
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
	    callback(oAuth2Client);
    });
  });
}

async function getLayout(sheetName) {
	var request = {
    spreadsheetId: '1kCDJnekPOR12K9LcIqjlWf6d9nN-COFThr4fPln_7FM',
    range: sheetName + '!A2:G',
  };
	var data = null;
	sheets.spreadsheets.values.get(request, (err, res) => {
	   if (err) return console.log('The API returned an error: ' + err);
	   const rows = res.data.values;
	   if(rows.length){
			 data = rows;
	   } else {
	     data = undefined;
	   }
	 });
	 return new Promise((resolve) => {
		 var loaded = setInterval(() => {
			 if(data != null){
				 clearInterval(loaded);
				 resolve(data);
			 }
		 }, 100, loaded);
	 });
}
