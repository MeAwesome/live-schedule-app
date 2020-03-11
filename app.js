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

io.on("connection", function(socket){

	connections[socket.id] = new Connection(socket);

	socket.emit("connected_to_server");

	socket.on("disconnect", () => {
		delete connections[socket.id];
	});

});

function Connection(socket){
	this.socket = socket;
	this.socketId = socket.id;
}

function sendScheduleLayout(data){
	io.emit("layout_data", data);
}

function sendTime(){
	io.emit("current_time", {
		hour:moment().get("hour"),
		minute:moment().get("minute"),
		second:moment().get("second"),
		millisecond:moment().get("millisecond")
	});
}

setInterval(() => {
	sendTime();
}, 100);


const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), getLayout);
});

function authorize(credentials, callback) {
  const client_secret = credentials.installed.client_secret;
	const client_id = credentials.installed.client_id;
	const redirect_uris = credentials.installed.redirect_uris;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
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

function getLayout(auth) {
  const sheets = google.sheets({version: 'v4', auth});
	var request = {
    spreadsheetId: '1kCDJnekPOR12K9LcIqjlWf6d9nN-COFThr4fPln_7FM',
    range: 'A2:G',
  };
	setInterval(() => {
		sheets.spreadsheets.values.get(request, (err, res) => {
	    if (err) return console.log('The API returned an error: ' + err);
	    const rows = res.data.values;
	    if (rows.length) {
	      sendScheduleLayout(rows);
	    } else {
	      console.log('No data found.');
	    }
	  });
	}, 5000);
}
