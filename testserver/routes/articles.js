"use strict";

var express = require('express');

var ArticleProvider = require('./ArticleProvider');

var article_provider = new ArticleProvider('https://couch-jpgygax68-2470897322.iriscouch.com', 6984);

var router = express.Router();

router.use(require('body-parser').json());

// Special 
// TODO: remove/replace
router.get('/new_uuid', function(req, res) {
  console.log('articles.js: /new_uuid');
  article_provider.newUuid(function(err, data) {
    if (err) res.status(500); else res.json(data);
  })
})

var route = router.route('/articles');

route.get( function(req, res) {
  console.log('/articles GET');
  article_provider.getIndex( function(err, index) {
    if (err) console.log('failed to get index:', err);
    else console.log('Index:', index);
    res.end(JSON.stringify(index, null, '  '));
  })
})

route.post( function(req, res) {
  console.log('/articles POST', req.body);
  article_provider.save(req.body, function(err, data) {
    if (err) res.status(500).end();
    else res.status(200).json(data);
  })
})

router.get('/articles/:id', function(req, res) {
  console.log('/articles/:id GET');
  article_provider.getById(req.params.id, function(err, doc) {
    console.log('callback:', err, doc);
    if (err) res.status(500).end(); // TODO: examine error and map appropriate HTTP code
    else res.json(doc);
  })
})
  
module.exports = router;