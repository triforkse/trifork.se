var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , morgan = require('morgan')
  , fs = require('fs')
  , ip = require('./lib/ip')
  , mailer = require('./lib/mailer')
  , recaptcha = require('./lib/recaptcha')
  , handbook = require('./lib/handbook')
  , _ = require('lodash')
  , datetime = require('./lib/datetime')
  , meetup = require('./lib/meetup')
  , bodyParser = require('body-parser')
  , viewHelpers = require('./lib/view_helpers');


var app = express();
app.set('port', (process.env.PORT || 9090));
app.set('dev', (process.env.TF_ENV || "production"));

// Protect against common attacks.
// Keep track of OWASP for more.

app.use(function(req, res, next) {
  res.header('X-XSS-Protection', 1);
  res.header('X-Frame-Options', 'SAMEORIGIN');
  // We cannot use Google Maps with we do not enable "unsafe-eval"
  // since it uses document.write which is not CSP compatible.
  res.header('Content-Security-Policy', "script-src 'self' http://use.typekit.net https://*.google.com https://*.googleapis.com https://*.gstatic.com 'unsafe-eval'");
  next();
});

app.use(bodyParser.json());

// Enable Request Logging

app.use(morgan('dev'));

viewHelpers.init(app);

var cssCompile = function (str, path) {
  var style = stylus(str)
    .set('filename', path)
    .set('sourcemap', {basePath: "public/css", sourceRoot: "../"})
    .use(nib());

  // Write a source map.

  style.render(function() {
    fs.writeFileSync("public/css/main.css.map", JSON.stringify(style.sourcemap));
  });

  return style;
};

app.use(stylus.middleware(
  {
    src: __dirname + '/public'
    , compile: cssCompile
  }
));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

app.use('/libs', express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
  res.render('index',
    {title: 'Home'}
  );
});

app.get('/jobs', function (req, res) {
  res.render('jobs',
    {title: 'Jobs'}
  );
});

app.get('/contact', function (req, res) {
  res.render('contact',
    {title: 'Contact'}
  );
});

app.get('/goto-conference-stockholm', function (req, res) {
  res.render('goto',
    {title: 'GOTO Conference in Stockholm'}
  );
});

app.get('/handbook', function (req, res) {
  var handbookData = handbook.content();
  var handbookHtml = handbook.html(handbookData);
  res.render('handbook',
    {
      title: 'Trifork Handbook',
      chunk: function (coll, n) {
        var size = Math.ceil(coll.length / n);
        return _.chunk(coll, size);
      },
      handbookHtml: handbookHtml,
      handbookToc: handbook.toc(handbookData)
    }
  );
});

app.get('/handbook.epub', function (req, res) {
  res.sendFile("public/handbook.epub");
});

app.get('/handbook.docx', function (req, res) {
  res.sendFile("public/handbook.docx");
});

app.get('/handbook.pdf', function (req, res) {
  res.sendFile("public/handbook.pdf");
});

app.get('/handbook.md', function (req, res) {
  res.sendFile("public/handbook.md");
});

app.get('/goto-nights-stockholm', function (req, res) {
  var render = function (events) {
    res.render('events',
      {
        events: events,
        title: 'Events',
        format_date: datetime.format
      }
    );
  };

  var handleError = function () {
    console.error("Unable to fetch events from meetup.com. Rendering empty list.");
    render([]);
  };

  meetup.fetch_events().then(render, handleError);
});

app.post('/email', function (req, res) {

  var message =
    "Name: " + req.body.name + "\n\n" +
    "Email: " + req.body.email + "\n\n" +
    "Message:\n\n" + req.body.message;

  console.log("Contact Form Message", message);

  var handler = function(remote_ip) {
    var recaptchaToken = req.body.recaptchaToken;

    var mailOk = function() {
      console.log("Email Sent");
      res
        .json({ message: "Email sent."})
        .end();
    };

    var mailError = function() {
      res
        .status(500)
        .json({ message: "Mail failed to send."})
        .end();
    };

    var recaptchaOk = function() {
      console.log("Sending email");

      var to = 'thb@trifork.com';
      var from = 'contact-form@trifork.se';
      var subject = 'Trifork.se - Contact Form Submission';

      mailer.send(from, to, subject, message)
        .then(mailOk, mailError);
    };

    var recaptchaError = function(e) {
      console.warn("reCaptche validation failed", e);
      res.status(400).json({ message: "Invalid reCaptcha"}).end();
    };

    console.log("Checking reCaptcha", remote_ip, recaptchaToken);
    recaptcha.verify(recaptchaToken, remote_ip).then(recaptchaOk, recaptchaError);
  };

  if (process.env.TF_ENV === 'dev') {
    console.warn("DEV MODE: Using Server External IP for reCaptcha");
    ip.getExternalIp().then(handler);
  }
  else {
    ip.getRemoteIp(req).then(handler);
  }
});

// Redirect old URLs to new ones, to make the crawlers happy.

// TODO: Consider doing this in a nginx config instead so,
// the request does not make it all the way to the app.

var redirects = [
  ["/events", "/goto-nights-stockholm"]
];

redirects.forEach(function(options) {
  app.get(options[0], function(req, res) {
    res.redirect(301, "http://trifork.se" + options[1]);
  });
});

app.listen(app.get('port'));
