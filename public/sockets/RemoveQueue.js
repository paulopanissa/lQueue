module.exports = function(io){

    var sockets = io.sockets;

    sockets.on('connection', function(socket){
        // Adicionar a Fila de Atendimento
        socket.on("remove:Queue", function(data){

        });
    });
};
