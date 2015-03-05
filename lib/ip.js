var q = require('q');

module.exports.getExternalIp = function () {
  var deferred = q.defer();

  require('http').request({
    hostname: 'fugal.net',
    path: '/ip.cgi',
    agent: false
  }, function (res) {
    if (res.statusCode != 200) {
      throw new Error('non-OK status: ' + res.statusCode);
    }

    res.setEncoding('utf-8');

    var ipAddress = '';

    res.on('data', function (chunk) {
      ipAddress += chunk;
    });

    res.on('end', function () {
      deferred.resolve(ipAddress.trim());
    });
  }).on('error', function (err) {
    deferred.reject(err);
  }).end();

  return deferred.promise;
};

module.exports.getRemoteIp = function (req) {
  var deferred = q.defer();

  var ipAddr = req.headers["x-forwarded-for"];

  if (ipAddr) {
    var list = ipAddr.split(",");
    ipAddr = list[list.length - 1];
  }
  else {
    ipAddr = req.connection.remoteAddress;
  }

  deferred.resolve(ipAddr);

  return deferred.promise;
};
