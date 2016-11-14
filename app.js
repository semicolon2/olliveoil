var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/gallery', (req,res)=>{
    res.sendFile(path.join(__dirname, '/public/gallery.html'));
});

//start server
app.listen(4000, ()=>{
  console.log('listening on port 4000');
});
