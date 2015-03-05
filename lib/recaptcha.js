var https = require('https');
var q = require('q');
var querystring = require('querystring');

var SECRET_KEY = process.env.TF_RECAPTCHA_SECRET_KEY;

module.exports.verify = function(value, remoteip) {

  var deferred = q.defer();

  var postData = querystring.stringify({
    response: value,
    remoteip: remoteip,
    secret: SECRET_KEY
  });

  var options = {
    method: 'POST',
    host: 'www.google.com',
    path: '/recaptcha/api/siteverify',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var callback = function (response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      var json = JSON.parse(str);

      if (json.success) {
        deferred.resolve(json);
      }
      else {
        deferred.reject(json);
      }
    });
  };

  var req = https.request(options, callback);

  req.on('error', function (e) {
    deferred.reject(e);
  });

  req.write(postData);
  req.end();

  return deferred.promise;
};
