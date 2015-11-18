
function socket() {
    return io.connect(pinitContext.io + '/board');
}

pinit.factory('board', [socket]);
