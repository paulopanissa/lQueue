/**
 * Controllers AngularJS
 */
function MainCtrl($scope){
    $scope.teste = 'Testando';
}

function HomeCtrl($scope, listToQueue){
    $scope.list = [];
    listToQueue
        .get()
        .success(function(data){
            $scope.list = data;
        });
}

angular
    .module('nQueue')
    .controller('MainCtrl', MainCtrl)
    .controller('HomeCtrl', HomeCtrl)