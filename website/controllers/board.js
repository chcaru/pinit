
pinit.controller('BoardController', 
    ['$scope', '$mdToast', 'board', function($scope, $mdToast, board) {

    $scope.cols = 15;

    $scope.posts = [];

    board.on('init', function(posts) {

        $scope.posts = _.map(posts, function(post) {
            return angular.extend({
                rows: 3,
                cols: 3,
                background: 'url(' + post.url + ') no-repeat center'
            }, post);
        }).reverse();

        $scope.$apply();

        board.on('newPost', function(post) {
            $scope.posts.splice(0, 0, angular.extend({
                rows: 3,
                cols: 3,
                background: 'url(' + post.url + ')'
            }, post));

            $scope.$apply();

            $mdToast.show($mdToast.simple().content('New Post!'));
        });
    });

    board.emit('refresh');
}]);
