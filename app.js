var express = require('express')
    , stylus = require('stylus')
    , nib = require('nib')
    , morgan = require('morgan')
    , yaml = require('js-yaml')
    , fs = require('fs')
    , _ = require('lodash')
    , md = require('marked')
    , datetime = require('./lib/datetime')
    , meetup = require('./lib/meetup');


var app = express();

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib());
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(stylus.middleware(
    { src: __dirname + '/public'
        , compile: compile
    }
));

app.use(express.static(__dirname + '/public'));
app.use('/libs',  express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
    res.render('index',
        { title : 'Home' }
    );
});

app.get('/clients', function (req, res) {
    res.render('case-studies',
        { title : 'Case Studies' }
    );
});

app.get('/handbook', function (req, res) {
    var data = yaml.safeLoad(fs.readFileSync('handbook.yml', 'utf8'));
    res.render('handbook', {
            md: md,
            chunk: function(coll, n) { var size = Math.ceil(coll.length / n); return _.chunk(coll, size); },
            handbook: data
        }
    );
});

app.get('/events', function (req, res) {
    meetup.fetch_events().then(function(events) {
        res.render('events',
            {
                events: events,
                title: 'Events',
                format_date: datetime.format
            }
        );
    });
});


app.listen(8080);