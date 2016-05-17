module.exports = function(io){

    var sockets = io.sockets;

    // Start Server WebSocket
    var WebSocketServer = require('ws').Server
        , wss = new WebSocketServer({ port: 4080, path: '/tv' });



    var Client = [];
    function findClient(url) {
        return (Client.indexOf(url));
    }

    /**
     * Calling Socket.IO to WebSocket
     * @type {Array}
     */
    var waitCall = [];

    sockets.on('connection', function(socket){
        socket.on("call:Queue", function(data){
            waitCall.push(data);
        });

        setInterval(function(){
            if (waitCall[0] != undefined) {
                sockets.emit('tv:Calling', waitCall[0]);
                waitCall.shift();
            }
        }, 3000);

        // Desabilitado Websocket
        //wss.on('connection', function(ws) {
        //    Client.push(ws);
        //    console.log('Connected: %s', ws.upgradeReq.url);
        //
        //    setInterval(function () {
        //        if (waitCall[0] != undefined) {
        //            console.log(waitCall[0]);
        //            console.log(new Date());
        //            ws.send(JSON.stringify(waitCall[0]), function (err) {
        //                if (err != null) {
        //                    console.log("Error %s :" + err);
        //                }
        //            });
        //            waitCall.shift();
        //        }
        //    }, 1000);
        //});
    });
}
