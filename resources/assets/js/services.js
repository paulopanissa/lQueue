/**
 * Services
 */

angular
    .module('nQueue');
    .factory('listToQueue', listToQueue)



    function listToQueue($http){
        var base = '/list-to-queue'
        return {
            get: function(){
                return $http.get(base);
            }
        }
    }