
// This is a wrapper around Microsoft's Project Oxford Vision API v1

var https = require('https');

function ProjectOxfordVisionAPI(apiKey) {

    this.hostname = 'api.projectoxford.ai'
    this.path = '/vision/v1/analyses';
    this.apiKey = apiKey;
}

ProjectOxfordVisionAPI.prototype.analyze = function(imageUrl) {

    var options = {
        hostname: this.hostname,
        path: this.path,
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': this.apiKey,
            'Content-Type': 'application/json'
        }
    };

    var deferred = Q.defer();

    var request = https.request(options, function(response) {

        response.setEncoding('utf8');
        response.on('data', function(data){

            deferred.resolve(JSON.parse(data));
        });
    });

    request.write(JSON.stringify({
        Url: imageUrl
    }));
    request.end();

    request.on('error', function(error) {
        deferred.reject(error);
    });

    return deferred.promise;
};

exports.ProjectOxfordVisionAPI = ProjectOxfordVisionAPI;
