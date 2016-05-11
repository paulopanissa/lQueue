function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $authProvider, $httpProvider, $provide){

    $urlRouterProvider.otherwise("/");

    $ocLazyLoadProvider.config({
        debug: true
    });

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/home/index.html',
            data: {
                specialClass: 'nqueueBg',
                pageTitle: 'Retire sua senha - Cartório Ayache'
            }
        });


}


angular
    .module(config)
    .run(function($rootScope, $state, $timeout, amMoment){
        $rootScope.$state = $state;

        // MomentJS locale text in Portugues.
        amMoment.changeLocale('pt-br');
    });