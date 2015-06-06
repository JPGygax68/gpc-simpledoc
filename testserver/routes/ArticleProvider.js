"use strict";

var cradle = require('cradle');

var design_doc = require("./articles_design.js");

function ArticleProvider(host, port)
{
  this.connection = new (cradle.Connection)(host, port, {
    cache: true,
    raw: false
  })
  
  this.db = this.connection.database('gpc_articles');
  
  this.db.exists( function(err, exists) {
    if (err) {
      console.log('Database existence check error:', err);
    }
    else if (exists) {
      console.log('Ok, database exists');
      this.db.save("_design/all", design_doc, function(err, result) {
        if (err) console.log('Failed to save design document:', err);
        else console.log('Design document saved successfully.');
      });
    }
    else {
      console.log('Database does not exist, attempting to create');
      this.db.create();
    }
  }.bind(this))
}

ArticleProvider.prototype.newUuid = function(callback)
{
  console.log('ArticleProvider::newUuid');
  
  this.connection.uuids(1, function(err, data) {
    console.log('err:', err, 'data:', data);
    if (err) callback(data);
    else callback(null, data[0]);
  });
}

ArticleProvider.prototype.getIndex = function(callback)
{
  //this.db.all( function(err, res) { callback(err, res); });
  this.db.view('all/index', {}, function(err, res) { callback(err, res); });
}

ArticleProvider.prototype.findAll = function(callback)
{
  console.log('findAll');
  
  this.db.view('articles/all', function(error, result) {
  
    if (error) {
      console.log('findAll error:', error);
      callback(error);
    }
    else {
      var docs = [];
      // TODO: why make a copy ?
      result.forEach( function(row) { docs.push(row); } );
      callback(null, docs);
    }
  })
}

ArticleProvider.prototype.getById = function(id, callback)
{
  this.db.get(id, function(error, result) {
    
    if (error) callback(error);
    else callback(null, result);
  })
}

ArticleProvider.prototype.save = function(articles, callback)
{
  if (typeof articles.length === 'undefined') articles = [ articles ];
  
  // Set creation date (= now) on all articles
  for (var i = 0; i < articles.length; i ++) {
    
    var article = articles[i];
    article.created_at = new Date();
    // TODO: comments ?    
  }
  
  // Save all the articles
  this.db.save(articles, function(error, result) {
    if (error) callback(error);
    else callback(null, articles);
  })
}

module.exports = ArticleProvider;
