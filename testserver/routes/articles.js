"use strict";

var express = require("express");
var cradle = require("cradle");

var COUCHDB = {
  host: 'https://couch-jpgygax68-2470897322.iriscouch.com',
  port: 6984
}

// CouchDB connection + initialization ------------------------------

var connection = new (cradle.Connection)(COUCHDB.host, COUCHDB.port, {
  cache: true,
  raw: false
})

var database = connection.database('gpc_articles');

database.exists( function(err, exists) {
  
  if (err) {
    console.log('Database existence check error:', err);
  }
  else if (exists) {
    console.log('Ok, database exists');
    database.save("_design/all", require("./articles_design.js"), function(err, result) {
      if (err) console.log('Failed to save design document:', err);
      else console.log('Design document saved successfully.');
    });
  }
  else {
    console.log('Database does not exist, attempting to create');
    database.create();
  }
}.bind(this))

// Router -----------------------------------------------------------

var router = express.Router();

router.use(require('body-parser').json());

// Special 
// TODO: remove/replace
/*
router.get('/new_uuid', function(req, res) {
  console.log('articles.js: /new_uuid');
  article_provider.newUuid(function(err, data) {
    if (err) res.status(500); else res.json(data);
  })
})
*/

var route = router.route('/articles');

route.get( function(req, res) {
  console.log('/articles GET');

  database.view('all/index', {}, function(err, index) {
    if (err) {
      console.log('Failed to get index, CouchDB error:', err);
      res.status(404)
        .end('CouchDB error while trying to get document index: ' + err.toString()); // TODO: map error codes
      return;
    }
    console.log('Index:', index);
    res.end(JSON.stringify(index, null, '  '));
  })
})

route.post( function(req, res) {
  console.log('/articles POST', req.body);

  var articles = req.body;
  if (typeof articles.length === 'undefined') articles = [ articles ];
  
  // Timestamp each article
  _.each(articles, function(article) { article.created_at = new Date(); });
  
  // Save on CouchDB
  database.save(articles, function(error, result) {
    if (error) {
      res.status(404)
        .end('CouchDB error while trying to save document: ' + err.toString()); // TODO: map error codes
      return;
    }
    res.json(result);
  })
})

router.get('/articles/:id', function(req, res) {
  console.log('/articles/:id GET');
  
  database.get(req.params.id, function(error, doc) {
    
    if (error) {
      res.status(404)
        .end('CouchDB error while trying to load document: ' + err.toString()); // TODO: map error codes
      return;
    }
    res.json(doc);
  })
})
  
module.exports = router;