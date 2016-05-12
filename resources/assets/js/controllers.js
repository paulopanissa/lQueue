/**
 * Controllers AngularJS
 */
function MainCtrl($scope){
    $scope.teste = 'Testando';
}

function AuthCtrl(){

}

function HomeCtrl($scope, QueueModel){

    var vm = this;

    $scope.list = [];
    QueueModel
        .listToQueue()
        .success(function(data){
            $scope.list = data;
        });


    vm.getQueue = function($queue){
        QueueModel.
            addInQueue($queue)
            .success(function(data){
                //socket.emit("add:Queue", data);
                self._waitPrinter = false;
        })

    };

    /**
     * Get Date Totem
     * @returns {string}
     */
    vm.dateDay = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        var today = dd+'/'+mm+'/'+yyyy;
        return today;
    };

    /**
     * Reload Page
     */
    vm.refresh = function(){
        location.reload();
    };
}

angular
    .module('nQueue')
    .controller('MainCtrl', MainCtrl)
    .controller('AuthCtrl', AuthCtrl)
    .controller('HomeCtrl', HomeCtrl)
;