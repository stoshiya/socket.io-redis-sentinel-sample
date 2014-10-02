var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('express-redis-sentinel-sample');

var routes = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

var redisSentinel = require('redis-sentinel');
var endPoints = [{ host: 'localhost', port: 26379 }, { host: 'localhost', port: 26380 }];
var masterName = 'mymaster';
var pub = redisSentinel.createClient(endPoints, masterName, { role: 'master' });
var sub = redisSentinel.createClient(endPoints, masterName, { role: 'master' });

var io = require('socket.io')(server);
var redis = require('socket.io-redis');
io.adapter(redis({ pubClient: pub, subClient: sub }));

io.on('connection', function(socket) {
  socket.on('message', function(data) {
    socket.broadcast.emit('message', data);
  });
});

var errorHandler = function(err) {
  console.error(err);
};

pub.on('connect', function() {
  console.log('connect pub');
});
sub.on('connect', function() {
  console.log('connect sub');
});
pub.on('error', errorHandler); 
sub.on('error', errorHandler); 
process.on('uncaughtException', errorHandler);

