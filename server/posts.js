
function Posts() {

    this.posts = {};

    this.onNewSubs  = {};
    this.onVoteSubs = {};
    this.onCommentSubs = {};

    this.recent = [];
    this.maxRecent = 100;

    this.onMoveSubs = {};

    // TODO: load from db
}

Posts.prototype.getRecent = function() {

    var start = this.recent.length < this.maxRecent ? 0 : this.recent.length - this.maxRecent;

    return this.recent.slice(start);
};

Posts.prototype.adjust = function(post, change) {

    var activity = post.activity += change;

    var below = post.position - 1;

    var above = post.position + 1;

    if (change < 0 && below > 0 && activity < this.recent[below].activity) {

        var postBelow = this.recent[below];

        this.recent.splice(post.position, 1);
        this.recent.splice(below, 0, post);

        postBelow.position++;
        post.position--;

        this.notifyMove({
            id: post.id,
            before: postBelow.position,
            current: post.position
        });

    } else if (change > 0 && above < this.recent.length && activity > this.recent[above].activity) {

        var postAbove = this.recent[above];

        this.recent.splice(post.position, 1);
        this.recent.splice(above, 0, post);

        postAbove.position--;
        post.position++;

        this.notifyMove({
            id: post.id,
            before: postAbove.position,
            current: post.position
        });
    }

    // TODO: update db
};

Posts.prototype.notifyMove = function(mover) {

    for (var id in this.onMoveSubs) {

        var sub = this.onMoveSubs[id];

        if (sub) {
            sub(mover);
        }
    }
};

Posts.prototype.addPost = function(post) {

    post.comments = post.comments || [];
    post.votes = post.votes || {
        up: 0,
        down: 0
    };

    post.created = Date.now();
    post.activity = 1;
    post.position = this.recent.length;

    this.recent.push(post);

    this.posts[post.id] = post;

    for (var id in this.onNewSubs) {

        var sub = this.onNewSubs[id];

        if (sub) {
            sub(post);
        }
    }

    // TODO: update db
};

Posts.prototype.getPost = function(postId) {
    return this.posts[postId];
};

Posts.prototype.vote = function(postId, vote) {

    var post = this.posts[postId];

    if (vote > 0) {

        post.votes.up++;
        this.adjust(post, 1);

    } else {

        post.votes.down++;
        this.adjust(post, -1);
    }

    for (var id in this.onVoteSubs) {

        var sub = this.onVoteSubs[id];

        if (sub) {
            sub({
                postId: postId,
                vote: vote
            });
        }
    }

    // TODO: update db
};

Posts.prototype.comment = function(postId, comment) {

    var post = this.posts[postId];

    post.comments.push(comment);

    this.adjust(post, 1);

    for (var id in this.onCommentSubs) {

        var sub = this.onCommentSubs[id];

        if (sub) {
            sub({
                postId: postId,
                comment: comment
            });
        }
    }

    // TODO: update db
};

Posts.prototype.onNew = function(handleId, callback) {
    this.onNewSubs[handleId] = callback;
};

Posts.prototype.onVote = function(handleId, callback) {
    this.onVoteSubs[handleId] = callback;
};

Posts.prototype.onComment = function(handleId, callback) {
    this.onCommentSubs[handleId] = callback;
};

Posts.prototype.onMove = function(handleId, callback) {
    this.onMoveSubs[handleId] = callback;
};

Posts.prototype.unsubOnNew = function(handleId) {
    this.onNewSubs[handleId] = undefined;
};

Posts.prototype.unsubOnVote = function(postId, handleId) {
    this.onVoteSubs[postId][handleId] = undefined;
};

Posts.prototype.unsubOnComment = function(postId, handleId) {
    this.onCommentSubs[postId][handleId] = undefined;
};

Posts.prototype.unsubOnMove = function(handleId) {
    this.onMoveSubs[handleId] = undefined;
};

exports.Posts = Posts;
