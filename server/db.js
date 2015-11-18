
var mongodb = require('mongodb');

function PinitDb() {
}

PinitDb.prototype.start = function () {

    if (this.deferredConnection) {
        return this.deferredConnection;
    }

    this.deferredConnection = Q.defer();

    this.server = new mongodb.Server('localhost', '13037');
    this.db = new mongodb.Db('pinit', this.server);

    this.db.open(function(error, db) {

        if (error) {
            this.deferredConnection.error(error);
            return;
        }

        this.db = db;

        this.deferredConnection.resolve(this);
    });

    this.posts = this.db.collection('posts');
    this.posts.createIndex({id: 1});

    this.users = this.db.collection('users');
    this.users.createIndex({id: 1});

    return this.deferredConnection;
};

PinitDb.prototype.getPosts = function() {

    var deferred = Q.defer();

    this.posts.find({}).toArray(function (error, posts) {

        if (error) {
            deferred.reject(error);
            return;
        }

        deferred.resolve(posts);
    });

    return deferred.promise;
};

PinitDb.prototype.getPost = function(postId) {

    var deferred = Q.defer();

    this.posts.find({ id: postId}).limit(1).toArray(function (error, posts) {

        if (error || posts.length <= 0) {
            deferred.reject(error);
            return;
        }

        deferred.resolve(posts[0]);
    });

    return deferred.promise;
};

PinitDb.prototype.addPost = function(post) {

    var deferred = Q.defer();

    this.posts.insertOne(post, function(error, post) {

        if (error) {
            deferred.reject(error);
            return;
        }

        deferred.resolve(post);
    });

    return deferred.promsie;
};

PinitDb.prototype.updatePost = function(post) {

    var deferred = Q.defer();

    this.posts.updateOne({ id: post.id }, post, function(error, post) {

        if (error) {
            deferred.reject(error);
            return;
        }

        deferred.resolve(post);
    });

    return deferred.promsie;
};

PinitDb.prototype.removePost = function(postId) {

    var deferred = Q.defer();

    this.posts.deleteOne({ id: postId}, function(error) {

        if (error) {
            deferred.reject(error);
            return;
        }

        deferred.resolve();
    });

    return deferred.promsie;
};

PinitDb.prototype.getUser = function(userId) {

    var deferred = Q.defer();

    this.users.find({ id: userId }).limit(1).toArray(function (error, users) {

        if (error || users.length <= 0) {
            deferred.reject(error);
            return;
        }

        deferred.resolve(users[0]);
    });

    return deferred.promise;
};

PinitDb.prototype.addUser = function(post) {

    var deferred = Q.defer();

    this.users.insertOne(user, function(error, user) {

        if (error) {
            deferred.reject(error);
            return;
        }

        deferred.resolve(user);
    });

    return deferred.promsie;
};

PinitDb.prototype.updateUser = function(user) {

    var deferred = Q.defer();

    this.users.updateOne({ id: user.id }, user, function(error, user) {

        if (error) {
            deferred.reject(error);
            return;
        }

        deferred.resolve(user);
    });

    return deferred.promsie;
};

PinitDb.prototype.removeUser = function(userId) {

    var deferred = Q.defer();

    this.users.deleteOne({ id: userId }, function(error) {

        if (error) {
            deferred.reject(error);
            return;
        }

        deferred.resolve();
    });

    return deferred.promsie;
};

exports.PinitDb = PinitDb;
