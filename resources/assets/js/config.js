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

