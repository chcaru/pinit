
pinit.controller('BoardController',
    ['$scope', '$mdToast', '$mdDialog', 'board',
        function($scope, $mdToast, $mdDialog, board) {

    $scope.cols = 15;
    $scope.posts = [];

    var postLookup = {};

    function subscribeToPost(post) {
        board.emit('subOnVote', post.id);
        board.emit('subOnComment', post.id);
        postLookup[post.id] = post;
    }

    $scope.vote = function(postId, vote) {

        if (localStorage['v-' + postId]) {
            return;
        }

        board.emit('vote', {
            postId: postId,
            vote: vote
        });

        localStorage['v-' + postId] = vote;
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

        for (var postIndex in $scope.posts) {

            var post = $scope.posts[postIndex];

            subscribeToPost(post);

            post.comments = post.comments.reverse();
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
