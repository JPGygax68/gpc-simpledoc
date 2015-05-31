"use strict";

var express = require('express');
var stylus = require('stylus');
var nib = require('nib');

var ArticleProvider = require('./ArticleProvider');

var app = express();

function compileStylus(str, path) 
{
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

var article_provider = new ArticleProvider('https://couch-jpgygax68-2470897322.iriscouch.com', 6984);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
//app.use(express.logger('dev'));
app.use(stylus.middleware({src: __dirname + '/public', compile: compileStylus}));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  
  article_provider.findAll(function(error, data) { 
    //res.send(data);
    res.render('index', {});
  })
});

var server = app.listen(3000, function() {
  
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('Express server listening at http://%s:%s', host, port);
})
