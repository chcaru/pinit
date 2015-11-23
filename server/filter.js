
var oxford = require('./oxford');
var crypto = require('crypto');

// If there is no api key, then no profanity check will be done, only
// cache checks (dupes)
function PinitFilter(apiKey) {

    if (apiKey) {
        this.visionApi = new oxford.ProjectOxfordVisionAPI(apiKey);
    }

    this.postCreationCache = {};
}

PinitFilter.prototype.filter = function(createPostRequest) {

    var url = createPostRequest.url;
    var hash = crypto.createHash('md5').update(url).digest('hex');

    var item = this.postCreationCache[hash];

    if (item) {
        return item.accepted ? Q.resolve() : Q.reject();
    }

    var postCreationCache = this.postCreationCache;
    if (!this.visionApi) {

        postCreationCache[hash] = {
            accepted: true
        };

        return Q.resolve();
    }

    var deferred = Q.defer();

    this.visionApi.analyze(url, ['Adult', 'Categories']).then(function(data) {

        var accepted = !!(data.adult
            && data.adult.adultScore < .35
            && data.adult.racyScore < .4);

        postCreationCache[hash] = {
            accepted: accepted
        };

        if (accepted) {
            deferred.resolve();
        } else {
            console.log('rejected image');
            deferred.reject();
        }
    });

    return deferred.promise;
}

exports.PinitFilter = PinitFilter;
