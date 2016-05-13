var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Redis = require('ioredis');
var redis = new Redis();
var load = require('express-load');

load('sockets', {cwd: 'public'})
    .into(io, redis);

http.listen(3000, function(){
    console.log('Listening on Port 3000');
});