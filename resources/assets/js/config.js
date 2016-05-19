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

        .state('tv', {
            url: '/tv',
            templateUrl: 'partials/tv/index.html',
            controller: "TvCtrl as vm",
            data: {
                specialClass: 'nqueueBg',
                pageTitle: "Tv"
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: [
                                'vendor/buzz/dist/buzz.min.js'
                            ]
                        }
                    ]);
                }
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
        /**
         * Usuários Routes
         */
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

        .state('admin.ticket', {
            url: '/ticket/user-in-ticket',
            templateUrl: '/partials/admin/ticket/index.html',
            controller: "UsersInTicketCtrl as vm",
            data: { pageTitle: 'Usuário no Guichê', requireLogin: true }
        })

        .state('admin.ticket-create', {
            url: '/ticket/user-in-ticket/create',
            templateUrl: '/partials/admin/ticket/create.html',
            controller: "UsersInTicketCreateCtrl as vm",
            data: { pageTitle: "Novo Usuário no Guichê", requireLogin: true }
        })

        .state('admin.ticket-edit', {
            url: '/ticket/user-in-ticket/{id}/edit',
            templateUrl: '/partials/admin/ticket/edit.html',
            controller: "UsersInTicketEditCtrl as vm",
            data: { pageTitle: 'Editar o usuário no guichê', requireLogin: true }
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

