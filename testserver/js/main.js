"use strict";

var ajax = require('jquery').ajax;
var _ = require('underscore');

var gsd = require('gpc-simpledoc');
var SimpleDocEditor = gsd.Editor;
var ko = gsd.ko;

/*
ko.observable({  
    child_nodes: [
      { _type_: 'PARAGRAPH', content: "This is the first paragraph." },
      { _type_: 'PARAGRAPH', content: "So that makes this the second paragraph" }
]})
*/
    
gsd.init();

/* Since documents are now method-less JSON objects, we need a few conveniences
  to access their data.
 */ 
var DocumentHelper = {
  
  getTagline: function(doc) {
    
    console.log('getTagline:', doc);
    
    var text;
    
    if (_.isString(doc.title) && doc.title.length > 0) {
      text = doc.title;
    }
    else if (this.hasChildren(doc)) {
      text = doc.child_nodes[0].content;
      if (text.length > 80) text = text.slice(0, 80) + "...";
    }
    
    if (!_.isString(text)) text = '(unnamed/empty document)';

    console.log('text:', text);
    
    return text;
  },
  
  hasChildren: function(doc) {
    return doc.child_nodes && doc.child_nodes.length > 0;
  }
}

var data = {
  
  index: new ko.observableArray([]),
  
  docEditor: new SimpleDocEditor(),
  
  saveCurrentDocument: function(data) 
  // Save the currently loaded document.
  {
    console.log('saveDocument', data);
    
    /*
    ajax('/api/articles/new_uuid', {
      complete: function(data) {
        console.log('new_uuid:', data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('error:', textStatus);
      }
    })
    */
    /* ajax('/api/articles/new_uuid')
      .then( function(data) {
        console.log('new_uuid as promised:', data);
      }) */
    
    ajax('/api/articles', {
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(this.docEditor.getDocument())
    })
    .then( function(result) {
      console.log('success:', result);
    })
    .fail( function(err) {
      alert('Failed to store the document: ' + err);
    })
  }
}

ko.applyBindings(data);

ajax('/api/articles', { dataType: 'json' })
.then( function(result) {
  console.log('Index:', result);
  _.each(result, function(item) { 
    console.log('item:', item); 
    data.index.push( {
      tagline: item.value.tagline, //DocumentHelper.getTagline(item),
      load: function() {
        ajax('/api/articles/'+item.id, { dataType: 'json' })
          .then( function(doc) {
            console.log('got the document:', doc);
            data.docEditor.load(doc);
          })
          .fail( function(err) {
            alert('Failed to load the document: ' + err);
          })
      }
    });
  })
})
.fail( function(err) {
  alert('failed to obtain article list:' + err);
})

//-------------------
