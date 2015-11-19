
pinit.controller('BoardController',
    ['$scope', '$mdToast', 'board', function($scope, $mdToast, board) {

    $scope.cols = 15;
    $scope.posts = [];

    var postLookup = {};

    function subscribeToPost(post) {
        board.emit('subOnVote', post.id);
        board.emit('subOnComment', post.id);
        postLookup[post.id] = post;
    }

    $scope.vote = function(postId, vote) {
        board.emit('vote', {
            postId: postId,
            vote: vote
        });
    }

    board.on('init', function(posts) {

        $scope.posts = _.map(posts, function(post) {
            return angular.extend({
                rows: 3,
                cols: 3,
                background: 'url(' + post.url + ') no-repeat center'
            }, post);
        }).reverse();

        board.on('newPost', function(post) {

            $scope.posts.splice(0, 0, angular.extend({
                rows: 3,
                cols: 3,
                background: 'url(' + post.url + ') no-repeat center'
            }, post));

            $mdToast.show($mdToast.simple().content('New Post: ' + post.title));

            subscribeToPost($scope.posts[0]);

            $scope.$apply();
        });

        board.on('newMove', function(mover) {

            var post = postLookup[mover.postId];

            if (!post) {
                return;
            }

            var postIndex = $scope.posts.indexOf(post);

            $scope.posts.splice(postIndex, 1);
            $scope.posts.splice(postIndex - mover.move, 0, post);

            $scope.$apply();
        });

        for (var post in $scope.posts) {
            subscribeToPost($scope.posts[post]);
        }

        $scope.$apply();
    });

    board.on('newVote', function(postVote) {

        var post = postLookup[postVote.postId];

        if (post) {

            if (postVote.vote > 0) {
                post.votes.up++;
            } else {
                post.votes.down++;
            }
        }
    });

    board.on('newComment', function(postComment) {

        var post = postLookup[postComment.postId];

        if (post) {

            post.comments.splice(0, 0, postComment.comment);
        }
    });



    board.emit('refresh');
}]);
