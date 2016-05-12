module.exports = function(io, redis){
    redis.subscribe('event-example', function(err, count) {
    });
    redis.on('message', function(channel, message) {
        console.log('Message Recieved: ' + message);
        message = JSON.parse(message);
        io.emit(channel + ':' + message.event, message.data);
    });
};