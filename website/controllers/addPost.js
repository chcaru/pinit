
var isUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

pinit.controller('AddPostDialogController',
    ['$scope', '$mdDialog', 'posts',
    function($scope, $mdDialog, posts) {

    $scope.title = '';
    $scope.desc = '';
    $scope.url = '';

    $scope.close = function() {
        $mdDialog.hide();
    };

    $scope.submitPost = function() {

        if (!posts.canPost()
            || $scope.title.length < 2
            || $scope.title.length > 45
            || $scope.desc.length > 150
            || !isUrl.test($scope.url)) {

            return;
        }

        var post = {
            title: $scope.title,
            desc: $scope.desc,
            url: $scope.url
        };

        post = posts.post(post);

        $mdDialog.hide(post);
    };

}]);
