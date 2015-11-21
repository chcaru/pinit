
var isUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

pinit.controller('AddPostDialogController',
    ['$scope', '$mdDialog', 'board', 'userService',
    function($scope, $mdDialog, board, user) {

    $scope.title = '';
    $scope.desc = '';
    $scope.url = '';

    $scope.close = function() {
        $mdDialog.hide();
    };

    $scope.submitPost = function() {
        var image = new Image(); 
        image.src = $scope.url; //your image path here
        if (image.width == 0) {
            alert("URL is not a valid image!");
            return;
        }

        var timestamp = sessionStorage['post'] || 0;
        var delta = Date.now() - timestamp;

        if (delta < 13337
            || $scope.title.length < 2
            || $scope.title.length > 45
            || $scope.desc.length > 150
            || !isUrl.test($scope.url)) {

            return;
        }

        var post = {
            id: uuid(),
            title: $scope.title,
            desc: $scope.desc,
            url: $scope.url,
            user: user.getUserId()
        };

        board.emit('post', post);

        sessionStorage['post'] = Date.now();

        $mdDialog.hide(post);
    };

}]);
