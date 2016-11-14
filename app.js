var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
const env = require('./env.js');

var passport = require('passport');
require('./auth.js')(passport);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/olliveoil');
var User = require('./models/user.js');


var app = express();

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({secret: env.secret}));
app.use(passport.initialize());

//==============page routes======================================
app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/gallery', (req,res)=>{
    res.sendFile(path.join(__dirname, '/public/gallery.html'));
});

app.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.get('/admin', isLoggedIn, function(req, res){
    res.sendFile(path.join(__dirname, '/public/admin.html'));
});

//===============resource routes=================================




//start server
app.listen(env.listenPort, ()=>{
  console.log('listening on port '+env.listenPort);
});
