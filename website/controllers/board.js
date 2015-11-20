
pinit.controller('BoardController',
    ['$scope', '$mdToast', '$mdDialog', 'board',
        function($scope, $mdToast, $mdDialog, board) {

    $scope.cols = $(window).width() / 115;

    window.onresize = function() {
        $scope.cols = $(window).width() / 115;
        $scope.$apply();
    };

    $scope.posts = [];

    var postLookup = {};

    function subscribeToPost(post) {
        board.emit('subOnVote', post.id);
        board.emit('subOnComment', post.id);
        postLookup[post.id] = post;
    }

    function adjustSizes(posts) {

        var max = _.max(posts, function(post) {
            return post.activity;
        }).activity;

        // Reduce by 1 so that the post with the minimum activity
        // doesn't get reduced to 0
        var min = _.min(posts, function(post) {
            return post.activity;
        }).activity - 1;

        var delta = max - min;
        var binCount = 3;
        var binDelta = delta / binCount;
        var binDeltaRatio = binDelta / delta;

        for (var postIndex in posts) {

            var post = posts[postIndex];

            // Fit it between 0 and 1.
            var normalizedActivity = (post.activity - min) / delta;

            // Adjust the distribution of values:
            // TODO: try other distribution functions out
            // Adjust the distribution to be higher than lower
            // ( sqrt(0 < x < 1) > x )
            //normalizedActivity = Math.sqrt(normalizedActivity);

            // Select bin, round up, and add 1 to place the lower
            // bin size limit to 2
            var size = Math.ceil(normalizedActivity / binDeltaRatio) + 1;

            // TODO: maybe adjust # of cols based on width vs height?
            post.rows = post.cols = size;
        }
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

    $scope.hasVoted = function(postId, vote) {
        return localStorage['v-' + postId] == vote;
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
                rows: 2,
                cols: 2,
                background: 'url(' + post.url + ') no-repeat center'
            }, post);
        }).reverse();

        adjustSizes($scope.posts);

        board.on('newPost', function(post) {

            $scope.posts.splice(0, 0, angular.extend({
                rows: 2,
                cols: 2,
                background: 'url(' + post.url + ') no-repeat center'
            }, post));

            adjustSizes($scope.posts);

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

        post.activity += postVote.vote;

        if (post) {

            if (postVote.vote > 0) {
                post.votes.up++;
            } else {
                post.votes.down++;
            }
        }

        adjustSizes($scope.posts);

        $scope.$apply();
    });

    board.on('newComment', function(postComment) {

        var post = postLookup[postComment.postId];

        post.activity++;

        if (post) {
            post.comments.splice(0, 0, postComment.comment);
        }

        adjustSizes($scope.posts);

        $scope.$apply();
    });

    board.emit('refresh');
}]);
