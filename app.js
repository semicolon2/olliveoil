var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
const env = require('./env.js');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '/uploads'));
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

var upload = multer({storage: storage});

var passport = require('passport');
require('./auth.js')(passport);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/olliveoil');
var User = require('./models/user.js');


var app = express();

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        console.log('is authenticated');
        return next();
    } else {
        console.log("not authenticated");
        res.redirect('/login');
    }
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({secret: env.secret}));
app.use(passport.initialize());
app.use(passport.session());

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

app.get('/admin', isLoggedIn, (req, res)=>{
    res.sendFile(path.join(__dirname, '/public/admin.html'));
});

//===============resource routes=================================
app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin',
    failureRedirect: ''
}));

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

app.get('/resetAdmin', (req, res)=>{
    process.nextTick(function(){
        User.findOne({'username':'admin'}, function(err, user){
            if(err){
                console.log(err);
                res.send('server error');
                return;
            }
            if(user){
                user.password = user.generateHash(env.adminPass);
                user.save(function(err){
                    if(err){
                        res.send(err);
                        return;
                    }
                });
                res.send("success");
            } else {
                var newUser = new User();
                newUser.username = 'admin';
                newUser.password = newUser.generateHash(env.adminPass);
                newUser.save(function(err){
                    if(err){
                        res.send(err);
                        return;
                    }
                });
                res.send("success");
            }
        });
    });
});

app.post('/upload', upload.single('fileInput'), function(req, res, next){
    console.log(req.file.path);
    res.status(200).end();
});

//start server
app.listen(env.listenPort, ()=>{
  console.log('listening on port '+env.listenPort);
});
