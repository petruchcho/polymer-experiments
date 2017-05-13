var app = require('express')();
var http = require('http').Server(app);
var express = require('express');


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use("/bower_components", express.static(__dirname + "/bower_components"));

http.listen(3000, function(){
    console.log('listening on *:3000');
});