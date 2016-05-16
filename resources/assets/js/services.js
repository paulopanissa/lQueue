/**
 * Services
 */

angular
    .module('nQueue')
    .factory('socket', socket)
    .factory('Login', Login)
    .factory('QueueModel', QueueModel)
    .factory('QueueApi', QueueApi)
    .factory('UsersApi', UsersApi)
    .factory('Setting', Setting)
    .factory('SessionService', SessionService);

    /**
     * Socket
     * @param socketFactory
     * @returns {*}
     */
    function socket(socketFactory, SOCKET){
        var mySocket = socketFactory({
            ioSocket: io.connect('//'+SOCKET+':3000')
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
                return $http.get('/api/queue');
            },
            call: function ($data) {
                return $http.post('/api/queue/call', $data);
            },
            again: function ($data) {
                return $http.post('/api/queue/again', $data);
            },
            status: function ($id, $status) {
                return $http.put('/api/queue/status/' + $id, $status);
            }
        }
    }

    function UsersApi($http){
        return {
            paginate: function($last){
                return $http({
                    url: '/api/users/paginate',
                    method: "GET",
                    params: { page: $last }
                })
            },
            store: function(data){
                return $http.post('/api/users/create', data);
            },
            edit: function(id){
                return $http.get('/api/users/' + id + '/edit');
            }
        }
    }

    function Setting($http){
        var base = '/api/setting/';
        return {
            get: function($url){
                return $http.get(base + $url);
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