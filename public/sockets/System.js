module.exports = function(io){

    var sockets = io.sockets;

    sockets.on('connection', function(socket){


        /**
         * Add Users in Ticket Windows
         */
        socket.on("usersIn:add", function(data){
            sockets.emit("usersIn:into", data);
        });
        


    });
};
