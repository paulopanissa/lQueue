/**
 * Services
 */

angular
    .module('nQueue')
    .factory('QueueModel', QueueModel);

    /**
     * Socket
     * @param socketFactory
     * @returns {*}
     */
    function socket(socketFactory){
        var mySocket = socketFactory({
            ioSocket: io.connect()
        });
        return mySocket;
    }

    /**
     * Listar para Totem
     * @param $http
     * @returns {{get: get}}
     */
    function QueueModel($http){
        return {
            listToQueue: function(){
                return $http.get('/list-to-queue');
            },
            addInQueue: function($queue){
                return $http.post('/add-in-queue', {queue: $queue});
            }
        }
    }

    function addInQueue($http){
        return function($queue){
            return $http.get('/add-in-queue', $queue);
        }
    }