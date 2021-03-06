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

                $http.post('/api/authenticate/use-ticket', {id: $rootScope.currentUser.id})
                    .then(function(response){

                        var ticket = JSON.stringify(response.data);

                        localStorage.setItem('ticket', ticket);

                        $rootScope.ticketUser = response.data;
                        // Everything worked out so we can now redirect to
                        // the users state to view the data
                        $state.go('admin.queue');
                    });
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
            localStorage.removeItem('ticket');
            // Flip authenticated to false so that we no longer
            // show UI elements dependant on the user being logged in
            $rootScope.authenticated = false;
            // Remove the current user info from rootscope
            $rootScope.currentUser = null;
            $rootScope.ticketUser = null;
            $state.go('auth', {})
        });
    }
}

/**
 * Home Controller
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



function TvCtrl($scope, socket){
    var vm = this,
        self = $scope;

    $scope.inQueue = [];
    $scope._newCall;
    $scope._oldCall = [];


    socket.on('tv:Calling', function(data){
        vm.received(data);
    });

    vm.received = function(e){
        var received = e;
        $scope.$apply(function(){
            $scope._newCall = received;
            console.log($scope._newCall);
            /**
             * PASSAR OS PARAMETROS AQUI PARA FAZER O TOQUE DO AUDIO
             */
            PainelWeb.Alert.play();
        })
    };


    $scope.$watch('_newCall', function(newValue, oldValue){
        if(oldValue){
            var old = angular.copy(oldValue);
            if(!vm.compareNewAndOld($scope._newCall, old)){
                if(!vm.existsInArray($scope._oldCall, old.senha)){
                    $scope._oldCall.unshift(old);
                }
            }
            if($scope._oldCall.length >= 4){
                $scope._oldCall.pop();
            }
        }
    });

    vm.existsInArray = function(list, object){
        var x;
        for(x in list){
            console.log(list[x]);
            if(list.hasOwnProperty(x) && list[x].senha === object){
                console.log(list[x]);
                return true;
            }
        }
        return false;
    };

    vm.compareNewAndOld = function(nV, oV){
        if(nV.senha === oV.senha){
            return true;
        }else{
            return false;
        }
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

        // Pegando Index
        var _index = self._inQueue.indexOf(_update);
        
        // Enviar Para TV
        QueueApi
            .call({ id: _update.id, user_id: _user })
            .success(function(data){
                self._inCallingWait = data.id;
                socket.emit("call:Queue", data);
                socket.emit("remove:Queue", data);
                //ws.send(JSON.stringify(data));
                //self._inQueue.splice(_index, 1);
            });
    };

    socket.on("destroy:Queue", function(data){
        var inQueue = vm.findId(self._inQueue, data.id);
        var _index = self._inQueue.indexOf(inQueue);
        self._inQueue.splice(_index, 1);
    });


    /**
     * Status do Atendimento
     */
    self._saveCalling = null;

    self.showButtonsCancel = false;
    /**
     * Chamar Novamente
     * @param id
     */
    vm.novamente = function(id){
        QueueApi
            .again({id: id})
            .success(function(data){
                //ws.send(JSON.stringify(data));
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

    vm.findId = function(_inQueue, _id){
        for(var i=0;i<_inQueue.length; i++){
            if(_inQueue[i].id == _id){
                return _inQueue[i];
            }
        }
    };

    vm.removeQueue = function(_id){
        console.log(_id);
        QueueApi
            .status(_id, {status_id: 5})
            .success(function(response){
                var data = { id: _id };
                socket.emit("remove:Queue", data);

            });
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

function UsersInTicketCtrl($scope, socket, Setting){
    var vm = this,
        self = $scope;

    self._usersInTicket = [];

    self._init = function(){
        Setting
            .get('ticket/users-in-tickets')
            .success(function(response){
                self._usersInTicket = response;
            });
    };

    /**
     * Init Page
     */
    self._init();


    socket.on("usersIn:into", function(data){
        self._usersInTicket.push(data);
    });


    /**
     * Deletar Usuário do Guichê
     * @param _id
     * @param _index
     */
    vm.deleteUserInTicket = function(_id, _index){
        Setting
            .destroy('ticket/users-in-tickets-delete/' + _id)
            .success(function(response){
                self._usersInTicket.splice(_index, 1);
            })
    }
}

function UsersInTicketCreateCtrl($scope, Setting, socket){
    var vm = this,
        self = $scope;

    self.users = [];
    self.tickets = [];

    self._init = function(){
        Setting.get('ticket/users').success(function(response){self.users = response});
        Setting.get('ticket/tickets').success(function(response){self.tickets=response});
    };
    self._init();

    vm.register = function(form){
        Setting
            .save('ticket/user-in-tickets', form)
            .success(function(response){
                socket.emit("usersIn:add", response);
            });
    }

}

function UsersInTicketEditCtrl($scope, Setting, $stateParams){
    var vm = this,
        self = $scope;

    var _id = $stateParams.id;

    self.users = [];
    self.tickets = [];

    self._init = function(){
        Setting.get('ticket/users').success(function(response){self.users = response});
        Setting.get('ticket/tickets').success(function(response){self.tickets=response});
    };
    
    self._init();

    Setting
        .find('ticket/search', _id)
        .success(function(response){
            console.log(response);
        });

}


/**
 * Play Audios
 */
var PainelWeb = {
  Alert: {
        play: function(){
            var filename = new buzz.sound("/assets/media/alert/airport.mp3");
            filename.play();
        }
    }
};


angular
    .module('nQueue')
    .controller('MainCtrl', MainCtrl)
    .controller('AuthCtrl', AuthCtrl)
    .controller('ProfileCtrl', ProfileCtrl)
    .controller('HomeCtrl', HomeCtrl)
    .controller('TvCtrl', TvCtrl)
    .controller('QueueCtrl', QueueCtrl)
    .controller('UsersCtrl', UsersCtrl)
    .controller('UsersNewCtrl', UsersNewCtrl)
    .controller('UsersEditCtrl', UsersEditCtrl)
    .controller('UsersInTicketCtrl', UsersInTicketCtrl)
    .controller('UsersInTicketCreateCtrl', UsersInTicketCreateCtrl)
    .controller('UsersInTicketEditCtrl', UsersInTicketEditCtrl);