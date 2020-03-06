var express = require("express");
var os = require("os");
var app = express();
var serv = require("http").Server(app);
var io = require("socket.io")(serv,{});
var port = process.env.PORT || 51000;
app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/index.html");
});
app.use("/public", express.static(__dirname + "/public"));
serv.listen(port);
if(port != process.env.PORT){
	try{
		__ConnectTo__ = os.networkInterfaces()["Wi-Fi"][1].address + ":" + port;
	} catch {
		__ConnectTo__ = os.networkInterfaces()["Ethernet"][1].address + ":" + port;
	}
	console.clear();
	console.log("--> Webpage Started On } " + __ConnectTo__);
}
