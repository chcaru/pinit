
pinit.controller('BoardController',
    ['$scope', '$mdToast', '$mdDialog', 'posts',
        function($scope, $mdToast, $mdDialog, posts) {

    $scope.cols = $(window).width() / 65;

    window.onresize = function() {
        $scope.cols = $(window).width() / 65;
        $scope.$apply();
    };

    $scope.posts = [];

    $scope.vote = function(postId, vote) {
        return posts.vote(postId, vote);
    }

    $scope.hasVoted = function(postId, vote) {
        return posts.hasVoted(postId, vote);
    }

    $scope.openComments = function(post, $event) {

        var dialogScope = $scope.$new(true);
        dialogScope.post = post;

        $mdDialog.show({
            controller: 'CommentsDialogController',
            scope: dialogScope,
            targetEvent: $event,
            templateUrl: 'views/dialogs/comments.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    };

    $scope.createPost = function($event) {

        $mdDialog.show({
            controller: 'AddPostDialogController',
            scope: $scope.$new(true),
            targetEvent: $event,
            templateUrl: 'views/dialogs/addPost.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }

    $scope.$on('newVote', function() {
        $scope.$apply();
    });

    $scope.$on('newComment', function() {
        $scope.$apply();
    });

    posts.getRecent().then(function(getRecent) {

        $scope.posts = getRecent();

        $scope.$on('newPost', function(post) {
            $mdToast.show($mdToast.simple().content('New Post: ' + post.title));
            $scope.posts = getRecent();
            $scope.$apply();
        });

        $scope.$on('newMove', function() {
            $scope.posts = getRecent();
            $scope.$apply();
        });
    });

}]);
