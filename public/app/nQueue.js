/*
    Main File AngularJS
 */
(function(){
    'use strict';
    angular.
            module('nQueue', [
            'ui.router',
            'oc.lazyLoad',
            'satellizer',
            'ui.bootstrap',
            'btford.socket-io',
            'angularMoment'
        ]);
})();
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
/**
 * Configs and Routers
 * @param $stateProvider
 * @param $urlRouterProvider
 * @param $ocLazyLoadProvider
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider){

    $urlRouterProvider.otherwise("/");

    $ocLazyLoadProvider.config({
        debug: true
    });

    $stateProvider
        // Solicitar a Senha
        .state('home', {
            url: '/',
            templateUrl: 'partials/home/index.html',
            data: {
                specialClass: 'nqueueBg',
                pageTitle: 'Retire sua senha - Cartório Ayache'
            }
        })
        // Logar no Sistema
        .state('auth', {
            url: '/login',
            templateUrl: 'partials/auth/login.html',
            controller: 'AuthCtrl as vm',
            data: { pageTitle: 'Login', specialClass: 'gray-bg'}
        })


}


angular
    .module('nQueue')
    .config(config)
    .run(function($rootScope, $state, amMoment){
        $rootScope.$state = $state;

        // MomentJS locale text in Portugues.
        amMoment.changeLocale('pt-br');
    });


/**
 * Titulo da Pagina usar no public/app/config.js
 * @use data: { pageTitle: "Name Page" }
 * @param $rootScope
 * @param $timeout
 * @returns {{link: link}}
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'nQueue | Gerenciador de Filas';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'nQueue | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

function currentTime($timeout, dateFilter) {
    // return the directive link function. (compile function not needed)
    return function(scope, element, attrs) {
        var format,  // date format
            timeoutId; // timeoutId, so that we can cancel the time updates

        // used to update the UI
        function updateTime() {
            element.text(dateFilter(new Date(), format));
        }

        // watch the expression, and update the UI on change.
        scope.$watch(attrs.currentTime, function(value) {
            format = value;
            updateTime();
        });

        // schedule update in one second
        function updateLater() {
            // save the timeoutId for canceling
            timeoutId = $timeout(function() {
                updateTime(); // update DOM
                updateLater(); // schedule another update
            }, 1000);
        }

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time ofter the DOM element was removed.
        element.bind('$destroy', function() {
            $timeout.cancel(timeoutId);
        });

        updateLater(); // kick off the UI update process.
    }
}
/**
 * Horas do Auto Atendimento HH:mm:ii
 * @param $timeout
 * @returns {{restrict: string, template: string, controller: controller}}
 */
function ngClock($timeout){
    return {
        restrict: 'E',
        template:'<span class="time">'
        + '<span class="hours">'
        + '{{date.getHours() | pad}}'
        + '</span>:<span class="minutes">'
        + '{{date.getMinutes() | pad}}'
        + '</span>:<span class="seconds">'
        + '{{date.getSeconds() | pad}}'
        + '</span>'
        + '</span>',
        controller: function($scope, $element) {
            $scope.date = new Date();
            var tick = function() {
                $scope.date = new Date();
                $timeout(tick, 1000);
            };
            $timeout(tick, 1000);
        }
    }
}

/**
 * Mask para CPF e CNPJ
 * @returns {{require: string, restrict: string, link: link}}
 */
function maskCpfCnpj(){
    return {
        require: 'ngModel',
        restrict: "A",
        link: function(scope, element, attrs){
            scope.$watch(attrs.ngModel, function (v) {
                var cpfcnpj = v;
                if(cpfcnpj != undefined) {
                    var cMask = v.replace(/\D/g, '').length <= 11 ? '000.000.000-00' : '00.000.000/0000-00';
                    element.mask(cMask);
                }
            })
        }
    };
}

/**
 * Uppercase Directive
 * @returns {{require: string, link: link}}
 */
function capitalize(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return input ? input.toUpperCase() : "";
            });
            element.css("text-transform","uppercase");
        }
    };
}

/**
 * Style to Radio and Checkbox
 * @param $timeout
 * @returns {{restrict: string, require: string, link: link}}
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                    if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                        $scope.$apply(function() {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                        return $scope.$apply(function() {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            });
        }
    };
}

function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 200);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 100);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
}

function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();

            });
        }
    };
}

function fullScroll($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}

function slimScroll($timeout){
    return {
        restrict: 'A',
        scope: {
            boxHeight: '@'
        },
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: scope.boxHeight,
                    railOpacity: 0.9
                });

            });
        }
    };
}

angular
    .module('nQueue')
    .directive('pageTitle', pageTitle)
    .directive('currentTime', currentTime)
    .directive('ngClock', ngClock)
    .directive('maskCpfCnpj', maskCpfCnpj)
    .directive('capitalize', capitalize)
    .directive('icheck', icheck)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('sideNavigation', sideNavigation)
    .directive('fullScroll', fullScroll)
    .directive('slimScroll', slimScroll);
function pad() {
    return function(num) {
        return (num < 10 ? '0' + num : num); // coloca o zero na frente
    };
}
/**
 * Mask to CPF/CNPJ in {{ documento | CPF }}
 * @returns {Function}
 */
function cpfcnpj(){
    return function(input) {
        if(input != undefined)
        {
            if(input.length <= 11){
                var str = input+ '';
                str = str.replace(/\D/g,'');
                str = str.replace(/(\d{3})(\d)/,"$1.$2");
                str = str.replace(/(\d{3})(\d)/,"$1.$2");
                str = str.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
                return str;
            }else{
                var str = input+ '';
                str = str.replace(/\D/g,'');
                str = str.replace(/(\d{2})(\d)/,"$1.$2");
                str = str.replace(/(\d{3})(\d)/,"$1.$2");
                str = str.replace(/(\d{3})(\d)/,"$1/$2");
                str = str.replace(/(\d{4})(\d{1,2})$/,"$1-$2");
                return str;
            }
        }
    };
}

function attend(){
    return function(input){
        if(input != undefined){
            if(input==1){
                return "Normal";
            }else if(input==2){
                return "Preferencial";
            }else if(input==3){
                return "Mensalista"
            }
        }
    }
}

angular
    .module('nQueue')
    .filter('pad', pad)
    .filter('cpfcnpj', cpfcnpj)
    .filter('attend', attend);
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
//# sourceMappingURL=nQueue.js.map
