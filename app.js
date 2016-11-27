const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const env = require('./env.js');
const multer = require('multer');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '/public/uploads/'+req.body.gallery));
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

const passport = require('passport');
require('./auth.js')(passport);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/olliveoil');
const User = require('./models/user.js');
const Gallery = require('./models/gallery.js');

const app = express();

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
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
    console.log('what is happening');
    res.render('index');
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

app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/login');
});

app.get('/resetAdmin', (req, res)=>{
    process.nextTick(function(){
        User.findOne({'username':'admin'}, function(err, user){
            if(err){
                console.log(err);
                res.status(500).end();
                return;
            }
            if(user){
                user.password = user.generateHash(env.adminPass);
                user.save(function(err){
                    if(err){
                        res.status(500).end();
                        return;
                    }
                });
                res.status(200);
            } else {
                var newUser = new User();
                newUser.username = 'admin';
                newUser.password = newUser.generateHash(env.adminPass);
                newUser.save(function(err){
                    if(err){
                        res.status(500).end();
                        return;
                    }
                });
                res.status(200).end();
            }
        });
    });
});

app.post('/upload', isLoggedIn, upload.fields([{name: 'fileInput', maxCount: 1}, {name: 'thumb', maxCount: 1}]), (req, res, next)=>{
    console.log(req.files);
    var newItem = {gallery:req.body.gallery, name:req.body.name, fileName:req.files.fileInput[0].filename, path:req.files.fileInput[0].path, thumbPath:req.files.thumb[0].path};
    Gallery.findOneAndUpdate({'gallery':req.body.gallery, 'name':req.body.name}, newItem, {upsert:true, new:true}, function(err, item){
        if(err){
            console.log(err);
            return res.status(500).end();
        } else {
            return res.status(200).send(item);
        }
    });
});

app.delete('/delete/:id', isLoggedIn, (req, res)=>{
    Gallery.findByIdAndRemove(req.params.id, function(err, item){
        if(err){
            console.log(err);
            return res.status(500).end();
        } else {
            fs.unlink(item.path, function(err){
                if(err){
                    console.log(err);
                    return res.status(500).end();
                } else {
                    fs.unlink(item.thumbPath, function(err){
                        if(err){
                            console.log(err);
                            return res.status(500).end();
                        } else {
                            return res.status(200).end();
                        }
                    });
                }
            });
        }
    });
});

app.get('/galleryItems/:gallery', (req, res)=>{
    Gallery.find({'gallery':req.params.gallery}, 'name fileName', function(err, galleryItems){
        if(err){
            console.log(err);
            return res.status(500).end();
        }
        res.status(200).send(galleryItems);
    });
});

//start server
app.listen(env.listenPort, ()=>{
  console.log('listening on port '+env.listenPort);
});
