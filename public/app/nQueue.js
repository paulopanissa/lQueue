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
/**
 * Configs and Routers
 * @param $stateProvider
 * @param $urlRouterProvider
 * @param $ocLazyLoadProvider
 */
function config($ocLazyLoadProvider, $stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide){

    function redirectWhenLoggedOut($q, $injector) {

        return {

            responseError: function(rejection) {

                // Need to use $injector.get to bring in $state or else we get
                // a circular dependency error
                var $state = $injector.get('$state');

                // Instead of checking for a status code of 400 which might be used
                // for other reasons in Laravel, we check for the specific rejection
                // reasons to tell us if we need to redirect to the login state
                var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                // Loop through each rejection reason and redirect to the login
                // state if one is encountered
                angular.forEach(rejectionReasons, function(value, key) {

                    if(rejection.data.error === value) {

                        // If we get a rejection corresponding to one of the reasons
                        // in our array, we know we need to authenticate the user so
                        // we can remove the current user from local storage
                        localStorage.removeItem('user');

                        // Send the user to the auth state so they can login
                        $state.go('auth');
                    }
                });

                return $q.reject(rejection);
            }
        }
    }

    // Setup for the $httpInterceptor
    $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

    // Push the new factory onto the $http interceptor array
    $httpProvider.interceptors.push('redirectWhenLoggedOut');

    $authProvider.loginUrl = '/api/authenticate';

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
        // Administrator

        .state('admin', {
            abstract: true,
            url: '/admin',
            templateUrl: 'partials/common/content.html',
            data: { requireLogin: true }
        })

        .state('admin.queue', {
            url: '/queue',
            templateUrl: 'partials/admin/queue/index.html',
            data: { pageTitle: 'Controle de Senhas', requireLogin: true }
        })

        .state('admin.users', {
            url: '/users',
            templateUrl: 'partials/admin/users/index.html',
            data: { pageTitle: 'Usuários', requireLogin: true }
        })

        .state('admin.users-create', {
            url: '/users/create',
            templateUrl: 'partials/admin/users/create.html',
            controller: "UsersNewCtrl as vm",
            data: { pageTitle: 'Adicione um novo usuário', requireLogin: true }
        })

        .state('admin.users-edit', {
            url: '/users/{id}/edit',
            templateUrl: 'partials/admin/users/edit.html',
            controller: "UsersEditCtrl as vm",
            data: { pageTitle: 'Editar Usuário', requireLogin: true }
        })
}


angular
    .module('nQueue')
    .config(config)
    .run(function($rootScope, $state, $timeout, amMoment){

        $rootScope.$state = $state;

        $rootScope.$on('$stateChangeStart', function(event, toState) {

            // Grab the user from local storage and parse it to an object
            var user = JSON.parse(localStorage.getItem('user'));

            // If there is any user data in local storage then the user is quite
            // likely authenticated. If their token is expired, or if they are
            // otherwise not actually authenticated, they will be redirected to
            // the auth state because of the rejected request anyway
            if(user) {

                // The user's authenticated state gets flipped to
                // true so we can now show parts of the UI that rely
                // on the user being logged in
                $rootScope.authenticated = true;

                // Putting the user's data on $rootScope allows
                // us to access it anywhere across the app. Here
                // we are grabbing what is in local storage
                $rootScope.currentUser = user;

                // If the user is logged in and we hit the auth route we don't need
                // to stay there and can send the user to the main state
                if(toState.name === "auth") {

                    // Preventing the default behavior allows us to use $state.go
                    // to change states
                    event.preventDefault();
                    // go to the "main" state which in our case is users
                    $state.go('admin.queue');
                }
            }

            var requireLogin = toState.data.requireLogin;
            $timeout(function(){
                if(requireLogin && !$rootScope.authenticated){
                    $state.go('auth');
                }
            }, 0);

            // Check your Access
            var access = toState.data.access;
            if(access && ($rootScope.currentUser.access < access)){
                // Redirect to Dashboard
                $state.go('admin.queue');
                event.preventDefault();
            }
        });

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
            }else if(input==3){
                return "Preferencial";
            }else if(input==2){
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

}

/**
 * Authenticate Controller
 * @param $auth
 * @param $state
 * @param $http
 * @param $rootScope
 * @constructor
 */
function AuthCtrl($auth, $state, $http, $scope, $rootScope){

    var vm = this;

    $scope.loginError   = false;
    $scope.loginErrorText = "";

    vm.login = function(login){
        var credentials = {
            username: login.username,
            password: login.password
        };
        $auth.login(credentials).then(function(){
                return $http.get('/api/authenticate/user')
            }, function(response){
            $scope.loginError = true;
                if(response.status===422){
                    $scope.isErrorType = 1;
                    $scope.loginErrorText = response.data.username[0];
                }else if(response.status == 401 && (response.data.error = "invalid_credentials")){
                    $scope.isErrorType = 2;
                    $scope.loginErrorText = "Sua senha está incorreta";
                }

            })
            .then(function(response){
                // Stringify the returned data to prepare it
                // to go into local storage
                var user = JSON.stringify(response.data.user);

                // Set the stringified user data into local storage
                localStorage.setItem('user', user);

                // The user's authenticated state gets flipped to
                // true so we can now show parts of the UI that rely
                // on the user being logged in
                $rootScope.authenticated = true;

                // Putting the user's data on $rootScope allows
                // us to access it anywhere across the app
                $rootScope.currentUser = response.data.user;

                // Everything worked out so we can now redirect to
                // the users state to view the data
                $state.go('admin.queue');
            })
    }

}

/**
 * Profile User
 * @param $http
 * @param $auth
 * @param $rootScope
 * @constructor
 */
function ProfileCtrl($http, $auth, $rootScope, $state){

    var vm = this;

    vm.logout = function() {
        $auth.logout().then(function() {
            // Remove the authenticated user from local storage
            localStorage.removeItem('user');
            // Flip authenticated to false so that we no longer
            // show UI elements dependant on the user being logged in
            $rootScope.authenticated = false;
            // Remove the current user info from rootscope
            $rootScope.currentUser = null;

            $state.go('auth', {})
        });
    }
}

/**
 *
 * @param $scope
 * @param QueueModel
 * @param socket
 * @constructor
 */
function HomeCtrl($scope, QueueModel, socket){
    /**
     * VM / SELF
     */
    var vm      = this,
        self    = $scope;
    /**
     * Desabilitar botão
     * @type {boolean}
     * @private
     */
    self._waitPrinter = false;
    /**
     * Lista de Atendimentos
     * @type {Array}
     */
    $scope.list = [];
    /**
     * Carregar Atendimentos pelo Factory
     */
    QueueModel
        .listToQueue()
        .success(function(data){
            $scope.list = data;
        });
    /**
     * Requisitar uma Senha.
     * @param $queue
     */
    vm.getQueue = function($queue){
        self._waitPrinter = true;
        QueueModel.
            addInQueue($queue)
            .success(function(data){
                socket.emit("add:Queue", data);
                self._waitPrinter = false;
        });
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

/**
 * Queue Manager
 * @param $scope
 * @param $rootScope
 * @param QueueApi
 * @param socket
 * @constructor
 */
function QueueCtrl($scope, $rootScope, QueueApi, socket){
    var self    = $scope,
        vm      = this;

    /**
     * Step for Change
     * @type {number}
     * @private
     */
    self._step = 1;

    /**
     * Fila de Atendimento
     */
    self._inQueue = [];

    /**
     * Adicionar a fila de todos
     * Via socket.io
     */
    socket.on("in:Queue", function(data){
        console.log(data);
        self._inQueue.push(data);
    });

    /**
     * Carregando Contado nos Botoes
     */
    self.$watchCollection('_inQueue', function(){
        self._normal = 0;
        self._preferencial = 0;
        self._mensalista = 0;
        angular.forEach(self._inQueue, function(value, key){
            if(value.queue_id==1){
                self._normal+=1;
            }else if(value.queue_id==3){
                self._preferencial+=1;
            }else if(value.queue_id==2){
                self._mensalista+=1;
            }
        })
    });

    /**
     * Carregando os Atendimentos do Banco de Dados
     * @private
     */
    self._loadQueue = function(){
        QueueApi
            .inQueue()
            .success(function(data){
                console.log(data);
                self._inQueue = data;
            })
    };

    /**
     * Inicializar
     */
    self._loadQueue();

    
    /**
     * Area to Calling Queue in TV
     */
    self._inCallingWait = null;

    // Chamar Nova Senha;
    vm.callQueue = function(atendimento){

        self._step = 2;
        
        // Pegando Usuário Logado
        var _user = $rootScope.currentUser.id;

        // Localizando Proximo na Fila
        var _update = vm.findAttend(self._inQueue, atendimento);
        console.log(_update);

        // Pegando Index
        var _index = self._inQueue.indexOf(_update);
        
        // Enviar Para TV
        QueueApi
            .call({ id: _update.id, user_id: _user })
            .success(function(data){
                self._inCallingWait = data.id;
                socket.emit("call:Queue", data);
                socket.emit("remove:Queue", { index: _index, data: data });
                ws.send(JSON.stringify(data));
                self._inQueue.splice(_index, 1);
            });
    };

    /**
     * Status do Atendimento
     */

    self._saveCalling;

    self.showButtonsCancel = false;
    /**
     * Chamar Novamente
     * @param id
     */
    vm.novamente = function(id){
        QueueApi
            .again({id: id})
            .success(function(data){
                ws.send(JSON.stringify(data));
                socket.emit("call:Queue", data);
            });
    };

    /**
     * Em Atendimento
     * @param id
     */
    vm.atendimento = function(id){
        self._step = 3;
        QueueApi
            .status(id, {status_id: 3})
            .success(function(data){
                console.log("Atendimento: ");
            });
    };

    /**
     * Atendimento Finalizado
     * @param id
     */
    vm.finalizado = function(id){
        self._step = 1;
        QueueApi
            .status(id, {status_id: 4})
            .success(function(data){
                console.log("Finalizado: ");
            });
    }
    /**
     * Desistiu do Atendimento
     * @param id
     */
    vm.desistiu = function(id){
        self._step = 1;
        QueueApi
            .status(id, {status_id: 5})
            .success(function(data){
                console.log("Desistiu: ");
            });

    };
    /**
     * Nao Compareceu ao Guichê
     */
    vm.naocompareceu = function(id){
        self._step = 1;
        QueueApi
            .status(id, {status_id: 6})
            .success(function(data){
                console.log("Não Compareceu: ");
            });

    }

    /**
     * Removendo da Fila da Atendimento
     * @param _inQueue
     * @param atendimento
     * @returns {*}
     */
    vm.findAttend = function(_inQueue, atendimento){
        for(var i=0; i < _inQueue.length; i++){
            if(_inQueue[i].queue_id == atendimento){
                return _inQueue[i]
            }
        }
    };

}


function UsersCtrl($scope, $rootScope, UsersApi){
    var vm = this,
        self = $scope;
    
    self.users = [];

    self.lastpage = 1;
    /**
     * Function Init Users
     */
    vm.initUsers = function ()
    {
        UsersApi
            .paginate(self.lastpage)
            .success(function(response){
                self.nextPage = (response.next_page_url) ? true : false;
                self.users = response.data;
                self.currentPage = response.current_page;
            });
    };
    /**
     * Start Init Users
     */
    vm.initUsers();

    vm.loadMore = function()
    {
        self.lastpage +=1;
        UsersApi
            .paginate(self.lastpage)
            .success(function(response){
                self.nextPage = (response.next_page_url) ? true : false;
                self.users = self.users.concat(response.data);
            })
    }
}

function UsersNewCtrl($scope, $state, UsersApi, Setting){

    var vm = this,
        self = $scope;

    self.items = [];

    self.form = {};

    self.initAccess = function(){
        Setting
            .get('access')
            .success(function(response){
                self.items = response;
                self.form.access = self.items[0].id;
            })
    };
    /**
     * loadAccess
     */
    self.initAccess();

    /**
     * Criar Usuário
     * @param form
     */
    vm.create = function(form){
        UsersApi
            .store(form)
            .success(function(data){
                if(data)
                    $state.go('admin.users')
            });
    }

}

function UsersEditCtrl($scope, $rootScope, $stateParams, UsersApi){
    var vm = this,
        self = $scope;

    self._id = $stateParams.id;

    self.form = {};

    UsersApi
        .edit(self._id)
        .success(function(response){
            self.form = response;
        });


    vm.edit = function(form){
        console.log(form);
    };

    vm.changePassword = function(password){
        console.log(password);
    };

    vm.verifyPassword = function (form) {
        if((form.password == null) || (form.password != form.cpassword)){
            return true
        }else {
            return false;
        }
    }




}

angular
    .module('nQueue')
    .controller('MainCtrl', MainCtrl)
    .controller('AuthCtrl', AuthCtrl)
    .controller('ProfileCtrl', ProfileCtrl)
    .controller('HomeCtrl', HomeCtrl)
    .controller('QueueCtrl', QueueCtrl)
    .controller('UsersCtrl', UsersCtrl)
    .controller('UsersNewCtrl', UsersNewCtrl)
    .controller('UsersEditCtrl', UsersEditCtrl);
//# sourceMappingURL=nQueue.js.map
