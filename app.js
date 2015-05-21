var express = require('express');
var path = require('path');
// var favicon = require('static-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var busboy = require('connect-busboy');

var routes = require('./routes/index');
// var uploader = require('./routes/upload');

var app = express();

app.use(function(req, res, next) {
  req.headers['if-none-match'] = 'no-match-for-this';
  next();    
});

// app.use(busboy());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon());
app.use(logger('dev'));

app.use(function(req, res, next) {
  //* allows all domains to make requests
  res.header("Access-Control-Allow-Origin", "*");
  //Allow header to specify what kind of request it was (XMLHttpRequest)
  res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Cache-Control"]);
  next();
}); 

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

module.exports = app;
