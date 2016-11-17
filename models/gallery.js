var mongoose = require('mongoose');
var db = mongoose.connection;

var gallerySchema = mongoose.Schema({
    gallery: String,
    name: String,
    fileName: String,
    path: String
});


module.exports = mongoose.model('Gallery', gallerySchema);
;
