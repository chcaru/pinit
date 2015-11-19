
pinit.controller('CommentsDialogController', ['$scope', '$mdDialog', 'board',
    function($scope, $mdDialog, board) {

    $scope.comment = '';

    $scope.close = function() {
        $mdDialog.hide();
    };

    $scope.submitComment = function() {

        var timestamp = sessionStorage['c-' + $scope.post.id] || 0;
        var delta = Date.now() - timestamp;

        if (delta < 1500) {
            return;
        }

        if ($scope.comment.length <= 100 && $scope.comment.length > 2) {
            //$scope.post.comments.splice(0, 0, $scope.comment);

            board.emit('comment', {
                postId: $scope.post.id,
                comment: $scope.comment
            });

            sessionStorage['c-' + $scope.post.id] = Date.now();
        }

        $scope.comment = '';
    };

}]);
