var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');

var logger = require('morgan');



const packageRouter = require('./routes/packagesRouter/packagesRouter');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/adminRouter');
const loginRouter = require('./routes/authRouter')
var app = express();
app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: true
}));

//db


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/auth', loginRouter);
app.use('/packages', packageRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
