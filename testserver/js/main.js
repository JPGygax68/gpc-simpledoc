"use strict";

var ajax = require('jquery').ajax;
var _ = require('underscore');

var gsd = require('gpc-simpledoc');
var SimpleDocEditor = gsd.Editor;
var ko = gsd.ko;

gsd.init();

var data = {
  
  index: new ko.observableArray([]),
  
  docEditor: new SimpleDocEditor(),
  
  docId: null,
  docRev: null,
  
  saveCurrentDocument: function(data) 
  // Save the currently loaded document.
  {
    console.log('saveDocument', data);
    
    /* ajax('/api/articles/new_uuid')
      .then( function(data) {
        console.log('new_uuid as promised:', data);
      }) */
    
    this.docEditor.commitChanges();
    
    // Obtain the current state of the document from the editor
    var doc = this.docEditor.document();
    
    // Transfer the store document key (id + rev for CouchDB)
    doc._id = this.docId, doc._rev = this.docRev;
    
    ajax('/api/articles', {
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(this.docEditor.document())
    })
    .then( function(result) {
      console.log('success:', result);
      reloadIndex();
    })
    .fail( function(err) {
      alert('Failed to store the document: ' + err);
    })
  }
}

ko.applyBindings(data);

reloadIndex();

//-------------------

function reloadIndex()
{
  ajax('/api/articles', { dataType: 'json' })
  .then( function(result) {
    console.log('Index:', result);
    var new_index = [];
    _.each(result, function(item) { 
      console.log('item:', item); 
      new_index.push( {
        tagline: item.value.tagline,
        load: function() {
          data.docId = data.docRev = null;
          ajax('/api/articles/'+item.id, { dataType: 'json' })
            .then( function(doc) {
              console.log('got the document:', doc);
              data.docEditor.load(doc);
              data.docId = doc._id, data.docRev = doc._rev;
            })
            .fail( function(err) {
              alert('Failed to load the document: ' + err);
            })
        }
      })
    })
    data.index(new_index);
  })
  .fail( function(err) {
    alert('failed to obtain article list:' + err);
  })
}

