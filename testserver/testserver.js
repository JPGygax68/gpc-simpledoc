"use strict";

var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var browserify = require('browserify-middleware');

var app = express();

function compileStylus(str, path) 
{
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
//app.use(express.logger('dev'));
app.use(stylus.middleware({src: __dirname + '/public', compile: compileStylus}));
app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/../dist'));
app.use('/js', browserify('./js'));

app.get('/', function (req, res) {
  
  res.render('index', {});
})

app.use('/api/articles', require('./api/articles')() );

var server = app.listen(3000, function() {
  
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('Express server listening at http://%s:%s', host, port);
})
