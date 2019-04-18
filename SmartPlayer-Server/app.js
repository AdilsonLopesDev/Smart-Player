var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var so_access = require('./api/files')
var players = require('./api/player');
var indexRouter = require('./routes/index');
var folderList = require('./routes/folderList');
var folders = require('./computer/folders');
const Cors = require('cors');
var app = express();

// view engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(Cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'helpers')));
app.use('/plyr', express.static(path.join(__dirname, 'node_modules', 'plyr', 'dist')));
app.use('/semantic', express.static(path.join(__dirname, 'node_modules', 'semantic-ui', 'dist')))
app.use('/', indexRouter);
app.use('/so_build', so_access)
app.use('/folderList', folderList);
app.use('/folders', folders);
app.use('/play', players);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(req, res, next) {
        console.log('Is loading')
    })
    // error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;