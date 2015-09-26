var https = require('https'),
  q = require('q'),
  cache = require('./cache').cache;

var API_KEY = process.env.TF_MEETUP_API_KEY;

var fetch_events = function () {

  var deferred = q.defer();

  var options = {
    host: 'api.meetup.com',
    path: '/2/events?&sign=true&photo-host=public&group_urlname=GOTO-Night-Stockholm&page=20&key=' + API_KEY
  };

  var callback = function (response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      var json = JSON.parse(str);
      deferred.resolve(json.results);
    });
  };

  var req = https.request(options, callback);

  req.on('error', function (e) {
    deferred.reject(e);
  });

  req.end();

  return deferred.promise;
};

module.exports.fetch_events = cache(fetch_events, 10000, true, []);
