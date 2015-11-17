
var pinit = angular.module('pinit', ['ui.router', 'ngMaterial']);

pinit.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('board', {
            url: '/',
            template: 'views/board.html',
            controller: 'BoardController'
        })
        .state('post', {
            url: '/post/{postId}',
            template: 'views/post.html',
            controller: 'PostController'
        })
        .state('my', {
            url: '/my/{userId}',
            template: 'views/my.html',
            controller: 'MyController'
        });

    $mdThemingProvider
        .theme('default')
        .primaryPalette('cyan')
        .accentPalette('grey-blue')
        .warnPalette('red')
        .backgroundPalette('grey');
}]);

var pinitContext = {
    api: 'http://localhost',
    io: 'http://localhost'
};
