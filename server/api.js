
var Posts = require('./posts').Posts;
var PinitFilter = require('./filter').PinitFilter;

function PinitAPI() {

    var bodyParser = require('body-parser');
    var express = require('express');
    var app = express();

    app.use(bodyParser.json());
    var server = require('http').Server(app);
    var io = require('socket.io')(server);
    app.use('/', express.static('../website'));

    server.listen(80);

    var posts = new Posts();

    var board = io.of('/board');

    var filter = new PinitFilter();

    board.on('connection', function(socket) {

        console.log('new connection: ' + socket.id);

        socket.on('refresh', function() {
            console.log('init: ' + socket.id);
            socket.emit('init', posts.getRecent());
        });

        socket.on('getPost', function(postId, reply) {
            console.log('get post: ' + socket.id);

            var post = posts.getPost(postId);

            if (post) {
                reply(post);
            }
        })

        socket.on('subOnVote', function(postId) {
            console.log('sub on vote: ' + socket.id);
            socket.join('vote-' + postId);
        });

        socket.on('subOnComment', function(postId) {
            console.log('sub on comment: ' + socket.id);
            socket.join('comment-' + postId);
        });

        socket.on('post', function(post) {
            console.log('submit post: ' + socket.id);
            filter.filter(post).then(function() {
                console.log('adding post: ' + socket.id);
                posts.addPost(post);
            });
        });

        socket.on('vote', function(postVote) {
            console.log('vote: ' + socket.id);
            posts.vote(postVote.postId, postVote.vote);
        });

        socket.on('comment', function(postComment) {
            console.log('comment: ' + socket.id);
            posts.comment(postComment.postId, postComment.comment);
        });
    });

    posts.onNew('board', function(post) {
        console.log('emitting post');
        board.emit('newPost', post);
    });

    posts.onMove('board', function(mover) {
        console.log('emitting move');
        board.emit('newMove', mover);
    });

    posts.onVote('board', function(postVote) {
        console.log('emitting vote: ' + postVote.postId);
        board.to('vote-' + postVote.postId).emit('newVote', postVote);
    });

    posts.onComment('board', function(postComment) {
        console.log('emitting comment: ' + postComment.postId);
        board.to('comment-' + postComment.postId).emit('newComment', postComment);
    });

}

exports.PinitAPI = PinitAPI;
