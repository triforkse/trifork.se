var mandrill = require('mandrill-api/mandrill');
var smtpApiKey = process.env.TF_MANDRILL_API_KEY;
var q = require('q');

module.exports.send = function (from, to, subject, body) {

  var deferred = q.defer();

  var client = new mandrill.Mandrill(smtpApiKey);

  var message = {
    "text": body,
    "subject": subject,
    "from_email": from,
    "from_name": "Trifork.se - Contact Form",
    "to": [{
      "email": to,
      "type": "to"
    }]
  };

  var ip_pool = "Main Pool";

  client.messages.send(
    {
      "message": message,
      "async": true,
      "ip_pool": ip_pool
    }, function (result) {
      if (result[0].status === "rejected") {
        deferred.reject(result[0].reject_reason);
      }
      else {
        deferred.resolve("ok");
      }
    }, function (e) {
      deferred.reject(e);
    });

  return deferred.promise;
};
