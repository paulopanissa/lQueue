module.exports = function(io){

    var sockets = io.sockets;

    sockets.on('connection', function(socket){
        // Remover da Fila de Atendimento para Todos
        socket.on("remove:Queue", function(data){
            sockets.emit('destroy:Queue', data);
        });
    });
};
