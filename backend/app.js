const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user.route');
const alterationShopRouter = require('./routes/alterationShop.route');
const reviewRouter = require('./routes/review.route');
const Result = require('./models/result');

const session = require('express-session');

require('./config/passport').config(passport);
require('dotenv').config({ path: './config/.env' });

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const hour = 3600000;
app.use(
  session({
     resave: false,
     saveUninitialized: false,
     secret: process.env.COOKIE_SECRET,
     cookie: {
        httpOnly: true,
        secure: false,
        expires : new Date(Date.now() + hour),
     },
  }),
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/alteration-shop', alterationShopRouter);
app.use('/api/review', reviewRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('connect-history-api-fallback')());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = 'err.message';
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.message);
  
  // render the error page
  const result = new Result();
  if(err.status) {
    result.message = err.message;
  }
  res.status(err.status || 500).send(result);
  res.render('error');
});

module.exports = app;
