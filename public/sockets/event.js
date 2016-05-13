module.exports = function(io){

    var sockets = io.sockets;

    sockets.on('connection', function(socket){
        // Adicionar a Fila de Atendimento
        socket.on("add:Queue", function(data){
            var _return = {
                senha: data.pwd,
                atendimento: data.queue,
                datetime: configDateTOCSharp(data.created_at.date)
            };
            console.log(_return)
            // Mandar dados para impressora
            sockets.emit('for:Print', _return);
            // Mandar dados para Usuário do Sistema

            var _inQueue = {
                id: data.id,
                pwd: data.pwd,
                queue_id: data.queue_id,
                created_at: data.created_at.date
            }
            sockets.emit('in:Queue', _inQueue);
        });
    });
};

function configDateTOCSharp(str){
    var moment = require('moment-timezone');
    var value = str.split('.');
    return moment.tz(value[0], "America/Campo_Grande").format();
}