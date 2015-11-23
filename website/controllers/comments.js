
pinit.controller('CommentsDialogController',
    ['$scope', '$mdDialog', 'posts',
        function($scope, $mdDialog, posts) {

    $scope.comment = '';

    $scope.close = function() {
        $mdDialog.hide();
    };

    $scope.submitComment = function() {

        if (!posts.canComment($scope.post.id)) {
            return;
        }

        if ($scope.comment.length <= 100 && $scope.comment.length > 2) {

            posts.comment($scope.post.id, $scope.comment);
        }

        $scope.comment = '';
    };

}]);
