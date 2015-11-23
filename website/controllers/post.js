
pinit.controller('PostController', ['$scope', '$stateParams', 'posts',
    function($scope, $stateParams, posts) {

        $scope.post = {
            id: -1,
            title: '',
            desc: '',
            votes: {
                up: 0,
                down: 0
            },
            comments: []
        };

        $scope.comment = '';

        $scope.vote = function(postId, vote) {
            return posts.vote(postId, vote);
        }

        $scope.hasVoted = function(postId, vote) {
            return posts.hasVoted(postId, vote);
        }

        $scope.submitComment = function() {

            if (!posts.canComment($scope.post.id)) {
                return;
            }

            if ($scope.comment.length <= 100 && $scope.comment.length > 2) {

                posts.comment($scope.post.id, $scope.comment);
            }

            $scope.comment = '';
        };

        $scope.$on('newVote', function() {
            $scope.$apply();
        });

        $scope.$on('newComment', function() {
            $scope.$apply();
        });

        posts.get($stateParams.postId).then(function(post) {

            $scope.post = post;

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
}]);
