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
    .factory('timeServer', timeServer)
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
            },
            find: function(url, data){
                return $http.get(base + url + '/' + data);
            },
            save: function(url, data){
                return $http.post(base + url, data);
            },
            update: function(url, data){
                return $http.put(base + url, data);
            },
            destroy: function(url){
                return $http.delete(base + url);
            }
        }

    }

    function timeServer($http){
        return {
            get: function(){
                return $http.get('/time-in-server');
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