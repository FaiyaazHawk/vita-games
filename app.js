var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

//routers
const indexRouter = require('./routes/index');
const devsRouter = require('./routes/devs');
const gamesRouter = require('./routes/games')
const genresRouter = require('./routes/genres')

var app = express();

//connection to Mongo DB
// Set up mongoose connection
const mongoose = require("mongoose");
const { type } = require('os');
const mongoDB = "mongodb+srv://Fhawk:Mongo@cluster0.awfm5pd.mongodb.net/vitastore?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//middleware
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', indexRouter);
app.use('/devs', devsRouter);
app.use('/games', gamesRouter);
app.use('/genres', genresRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
