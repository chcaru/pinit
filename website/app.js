
var pinit = angular.module('pinit', ['ui.router', 'ngMaterial']);

pinit.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('board', {
            url: '/',
            templateUrl: 'views/board.html',
            controller: 'BoardController'
        })
        .state('post', {
            url: '/post/{postId}',
            templateUrl: 'views/post.html',
            controller: 'PostController'
        })
        .state('my', {
            url: '/my/{userId}',
            templateUrl: 'views/my.html',
            controller: 'MyController'
        });

    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        .accentPalette('blue-grey')
        .warnPalette('red')
        .backgroundPalette('grey');
}]);

var pinitContext = {
    io: 'http://localhost' // debug
    //io: 'http://picit.cloudapp.net'
};
