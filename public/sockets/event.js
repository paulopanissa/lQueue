module.exports = function(io){

    var sockets = io.sockets;

    sockets.on('connection', function(socket){
        // Adicionar a Fila de Atendimento
        socket.on("add:Queue", function(data){
            var _return = {
                senha: data.pwd,
                atendimento: data.queue,
                datetime: data.created_at.date
            };
            console.log(_return);
            // Mandar dados para impressora
            sockets.emit('for:Print', _return);
            // Mandar dados para Usuário do Sistema
            sockets.emit('in:Queue', data);
        });



    });

};