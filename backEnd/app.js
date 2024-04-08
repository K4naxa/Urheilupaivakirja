require('dotenv').config()

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var isAuthenticated = require('./middleware/auth');


var indexRouter = require('./routes/index');
var loginRouter = require('./routes/user/loginRouter.js');
var registerRouter = require('./routes/user/registerRouter.js');
var journalRouter = require('./routes/journalRouter.js');   

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user/login', loginRouter);
app.use('/user/register', registerRouter);
app.use('/journal', isAuthenticated, journalRouter);


module.exports = app;