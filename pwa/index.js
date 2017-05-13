var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var userId = 0;

app.use("/bower_components", express.static(__dirname + "/bower_components"));

io.on('connection', function(socket){
    console.log('a user connected');
    io.emit('connected', userId);

    sendBatch(0, userId++);

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg) {
        console.log('chat message');
        saveMessage(msg);
        io.emit('chat message', msg);
    });

    socket.on('request batch', function(offset, id) {
        console.log('batch requested with offset = ' + offset);
        sendBatch(offset, id);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

var BATCH_SIZE = 6;
var messages = [];

function saveMessage(msg) {
    messages.unshift(msg);
}

function sendBatch(start, id) {
    console.log('messages size ' + messages.length);
    var messagesToSend = [];
    for (var i = start; messagesToSend.length < BATCH_SIZE && i < messages.length; i++) {
        messagesToSend.push(messages[i]);
    }
    console.log('batch size to send ' + messagesToSend.length);
    io.emit('batch', messagesToSend, id);
}