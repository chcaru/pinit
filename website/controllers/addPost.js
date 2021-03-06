
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
        var image = new Image();
        image.src = $scope.url; //your image path here
        if (image.width == 0) {
            alert("URL is not a valid image!");
            return;
        }

        if (!posts.canPost()
            || !isUrl.test($scope.url)) {
            alert('Unable to post!');
            return;
        }

        if ($scope.title.length < 2 || $scope.title.length > 35 ||
          $scope.desc.length < 0 || $scope.desc.length > 150) {
            alert('Invalid input lengths!');
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
