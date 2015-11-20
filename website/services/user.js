
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);});
}

function userService() {

    this.userId = localStorage.userId;

    if (!this.userId) {
        this.userId = uuid();
        localStorage.userId = this.userId;
    }
}

userService.prototype.getUserId = function () {
    return this.userId;
};

pinit.factory('userService', function() {
    return new userService();
});
