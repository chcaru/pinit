
var Posts = require('./posts').Posts;

function PinitAPI() {

    var bodyParser = require('body-parser');
    var express = require('express');
    var app = express();

    app.use(bodyParser.json());
    var server = require('http').Server(app);
    var io = require('socket.io')(server);
    app.use('/', express.static('../website'));

    //app.listen(80);
    server.listen(80);

    var posts = new Posts();

    var board = io.of('/board');

    board.on('connection', function(socket) {

        console.log('new connection: ' + socket.id);

        socket.on('refresh', function() {
            socket.emit('init', posts.getRecent());
        });

        socket.on('subOnVote', function(postId) {
            socket.join('vote-' + postId);
        });

        socket.on('subOnComment', function(postId) {
            socket.join('comment-' + postId);
        });

        socket.on('post', function(post) {
            posts.addPost(post);
        });

        socket.on('vote', function(postVote) {
            posts.vote(postVote.postId, postVote.vote);
        });

        socket.on('comment', function(postComment) {
            posts.comment(postComment.postId, postComment.comment);
        });
    });

    posts.onNew('board', function(post) {
        board.emit('newPost', post);
    });

    posts.onMove('board', function(mover) {
        board.emit('newMove', mover);
    });

    posts.onVote('board', function(postVote) {
        board.to('vote-' + postVote.postId).emit('newVote', postVote);
    });

    posts.onComment('board', function(postComment) {
        board.to('comment-' + postComment.postId).emit('newComment', postComment)
    });

}

exports.PinitAPI = PinitAPI;
