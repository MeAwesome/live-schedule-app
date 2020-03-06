var express = require("express");
var os = require("os");
var app = express();
var serv = require("http").Server(app);
var port = 51000;

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");
});
app.use("/", express.static(__dirname + "/"));

var __ConnectTo__;
try{
	__ConnectTo__ = os.networkInterfaces()["Wi-Fi"][1].address + ":" + port;
} catch {
	__ConnectTo__ = os.networkInterfaces()["Ethernet"][1].address + ":" + port;
}

serv.listen(port);
console.clear();
console.log("--> Webpage Started On } " + __ConnectTo__);
