var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , morgan = require('morgan')
  , fs = require('fs')
  , yaml = require('js-yaml')
  , handbook = require('./lib/handbook')
  , _ = require('lodash')
  , datetime = require('./lib/datetime')
  , meetup = require('./lib/meetup');


var app = express();
app.set('port', (process.env.PORT || 9090));


app.locals.padNum = function (n) {
  if (n < 10) {
    return "0" + n;
  }
  return "" + n;
};

function compile(str, path) {
  var style = stylus(str)
    .set('filename', path)
    .set('sourcemap', {basePath: "public/css", sourceRoot: "../"})
    .use(nib());

  // Write a source map.

  style.render(function() {
    fs.writeFileSync("public/css/main.css.map", JSON.stringify(style.sourcemap));
  });

  return style;
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(stylus.middleware(
  {
    src: __dirname + '/public'
    , compile: compile
  }
));

app.use(express.static(__dirname + '/public'));
app.use('/libs', express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
  res.render('index',
    {title: 'Home'}
  );
});

app.get('/clients', function (req, res) {
  res.render('case-studies',
    {title: 'Case Studies'}
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

app.get('/handbook', function (req, res) {
  var handbookData = handbook.content();
  var handbookHtml = handbook.html(handbookData);
  res.render('handbook',
    {
      chunk: function (coll, n) {
        var size = Math.ceil(coll.length / n);
        return _.chunk(coll, size);
      },
      handbookHtml: handbookHtml,
      handbookToc: handbook.toc(handbookData)
    }
  );
});

app.get('/handbook', function (req, res) {
  var handbookData = handbook.content();
  var handbookHtml = handbook.html(handbookData);
  res.render('handbook',
    {
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

app.get('/events', function (req, res) {
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


app.listen(app.get('port'));
