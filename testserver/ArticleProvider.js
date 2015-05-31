"use strict";

var cradle = require('cradle');

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
    }
    else {
      console.log('Database does not exist, attempting to create');
      this.db.create();
    }
  }.bind(this))
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

ArticleProvider.prototype.findById = function(id, callback)
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
