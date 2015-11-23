
function Posts($q, board, $rootScope, userService) {

    this.$q = $q;
    this.board = board;
    this.$rootScope = $rootScope;
    this.userService = userService;

    this.posts = {};
    this.recent = [];

    this.recentDeferred = null;

    var self = this;
    this.board.on('newVote', function(postVote) {

        var post = self.posts[postVote.postId];

        if (!post) {
            return;
        }

        post = post.post;

        post.activity += postVote.vote;

        if (postVote.vote > 0) {
            post.votes.up++;
        } else {
            post.votes.down++;
        }

        self.adjustSizes();

        self.$rootScope.$broadcast('newVote', postVote.postId, postVote.vote);
    });

    this.board.on('newComment', function(postComment) {

        var post = self.posts[postComment.postId];

        if (!post) {
            return;
        }

        post = post.post;

        post.activity++;

        post.comments.splice(0, 0, postComment.comment);

        self.adjustSizes();

        self.$rootScope.$broadcast(
            'newComment',
            postComment.postId,
            postComment.comment);
    });
}

Posts.prototype.set = function(post) {
    this.posts[post.id] = {
        post: post,
        sub: false
    };
}

Posts.prototype.get = function(postId) {

    var post = this.posts[postId];

    if (post) {
        return this.$q.resolve(post.post);
    }

    var deferred = this.$q.defer();

    var self = this;
    this.board.emit('getPost', postId, function(post) {

        self.set(post);

        post.comments = post.comments.reverse();

        self.sub(post.id);

        deferred.resolve(post);
    });

    return deferred.promise;
}

Posts.prototype.sub = function(postId) {

    var post = this.posts[postId];

    if (post && post.sub) {
        return;
    } else if (!post) {
        return;
    }

    this.board.emit('subOnVote', postId);
    this.board.emit('subOnComment', postId);

    post.sub = true;
};

Posts.prototype.adjustSizes = function() {

    var posts = this.recent;

    var max = _.max(posts, function(post) {
        return post.activity;
    }).activity;

    // Reduce by 1 so that the post with the minimum activity
    // doesn't get reduced to 0
    // var min = _.min(posts, function(post) {
    //     return post.activity;
    // }).activity - 1;

    var min = 0;

    var delta = max - min;
    var binCount = 4;
    var binDelta = delta / binCount;
    var binDeltaRatio = binDelta / delta;

    for (var postIndex in posts) {

        var post = posts[postIndex];

        if (post.activity <= 0) {
            post.rows = post.cols = 3;
            continue;
        }

        // Fit it between 0 and 1.
        var normalizedActivity = post.activity / delta;

        // Adjust the distribution of values:
        // Adjust the distribution to be lower than higher
        //normalizedActivity = Math.pow(normalizedActivity, 1.337)

        // Select bin, round up, and add 1 to place the lower
        // bin size limit to 2
        var size = Math.ceil(normalizedActivity / binDeltaRatio) + 2;

        // TODO: maybe adjust # of cols based on width vs height?
        post.rows = post.cols = size;
    }
}

Posts.prototype.getRecent = function () {

    if (this.recentDeferred) {
        return this.recentDeferred.promise;
    }

    this.recentDeferred = this.$q.defer();

    var self = this;

    this.board.on('init', function(posts) {

        self.recent = _.map(posts, function(post) {
            return angular.extend({
                rows: 2,
                cols: 2,
                background: 'url(' + post.url + ') no-repeat center'
            }, post);
        }).reverse();

        self.adjustSizes();

        self.board.on('newPost', function(post) {
            
            self.recent.splice(0, 0, angular.extend({
                rows: 2,
                cols: 2,
                background: 'url(' + post.url + ') no-repeat center'
            }, post));

            self.adjustSizes();

            self.set(post);
            self.sub(post.id);

            self.$rootScope.$broadcast('newPost', post);
        });

        self.board.on('newMove', function(mover) {

            var post = self.posts[mover.postId]

            if (!post) {
                return;
            }

            post = post.post;

            var postIndex = self.recent.indexOf(post);

            self.recent.splice(postIndex, 1);
            self.recent.splice(postIndex - mover.move, 0, post);

            self.$rootScope.$broadcast('newMove');
        });

        for (var postIndex in self.recent) {

            var post = self.recent[postIndex];

            self.set(post);
            self.sub(post.id);

            post.comments = post.comments.reverse();
        }

        self.recentDeferred.resolve(function() {
            return self.recent.slice();
        });
    });

    this.board.emit('refresh');

    return this.recentDeferred.promise;
};

Posts.prototype.canPost = function() {

    var timestamp = sessionStorage['post'] || 0;
    var delta = Date.now() - timestamp;

    return delta > 13337;
};

Posts.prototype.post = function(post) {

    post.id = uuid();
    post.user = this.userService.getUserId();

    this.board.emit('post', post);

    sessionStorage['post'] = Date.now();

    return post;
};

Posts.prototype.vote = function(postId, vote) {

    if (localStorage['v-' + postId]) {
        //return;
    }

    this.board.emit('vote', {
        postId: postId,
        vote: vote
    });

    localStorage['v-' + postId] = vote;
};

Posts.prototype.hasVoted = function(postId, vote) {
    return localStorage['v-' + postId] == vote;
};

Posts.prototype.comment = function(postId, comment) {

    if (!this.canComment(postId)) {
        return;
    }

    this.board.emit('comment', {
        postId: postId,
        comment: comment
    });

    sessionStorage['c-' + postId.id] = Date.now();
};

Posts.prototype.canComment = function(postId) {

    var timestamp = sessionStorage['c-' + postId] || 0;
    var delta = Date.now() - timestamp;

    return delta > 1500;
};

pinit.factory('posts',
    ['$q', 'board', '$rootScope', 'userService',
    function($q, board, $rootScope, userService) {
        return new Posts($q, board, $rootScope, userService);
}]);
