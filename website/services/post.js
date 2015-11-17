
function postService($http) {

    this.http = $http;
    this.socket = io.connect(pinitContext.io);


}

postService.prototype.getPost = function (postId) {

};

postService.prototype.getUserPosts = function (userId) {

};

postService.prototype.onNewPost = function () {

};

pinit.factory('postService', ['$http', postService]);
