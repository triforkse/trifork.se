var express = require('express')
    , stylus = require('stylus')
    , nib = require('nib')
    , morgan = require('morgan');


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


app.get('/events', function (req, res) {
    res.render('events',
        { title : 'Events' }
    );
});


app.listen(8080);