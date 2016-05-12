/**
 * Services
 */

angular
    .module('nQueue')
    .factory('socket', socket)
    .factory('Login', Login)
    .factory('QueueModel', QueueModel)
    .factory('QueueApi', QueueApi)
    .factory('SessionService', SessionService);

    /**
     * Socket
     * @param socketFactory
     * @returns {*}
     */
    function socket(socketFactory){
        var mySocket = socketFactory({
            ioSocket: io.connect('//192.168.10.10:3000')
        });
        return mySocket;
    }

    function Login($http){
        return {
            auth: function(login){
                return $http({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: '/api/authenticate',
                    method: 'POST',
                    data: {
                        username: login.username,
                        password: login.password
                    }
                });
            }
        }
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
        };
    }

    function QueueApi($http) {
        return {
            inQueue: function () {
                $http.get('/api/v1/queue');
            },
            call: function ($id) {

            },
            again: function ($id) {

            },
            status: function ($id, $status) {

            }
        }
    }

    function SessionService(){
        return {
            get: function(key){
                return sessionStorage.getItem(key);
            },
            set: function(key, value){
                return sessionStorage.setItem(key, value);
            },
            unset: function(key){
                return sessionStorage.removeItem(key);
            }
        }
    }