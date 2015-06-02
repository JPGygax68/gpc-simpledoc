"use strict";

var express = require('express');

var ArticleProvider = require('./ArticleProvider');

var article_provider = new ArticleProvider('https://couch-jpgygax68-2470897322.iriscouch.com', 6984);

module.exports = function() {

  var router = express.Router();
  
  router.get('/new_uuid', function(req, res) {
    console.log('articles.js: /new_uuid');
    article_provider.newUuid(function(err, data) {
      if (err) res.status(500); else res.json(data);
    })
  })
  
  return router;
}