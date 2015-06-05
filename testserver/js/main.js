"use strict";

var gsd = require('gpc-simpledoc');
var ko = gsd.ko;
//var ajax = require('component-ajax');
var ajax = require('jquery').ajax;
var _ = require('underscore');

gsd.init();

var data = {
  
  index: new ko.observableArray([]),
  
  newdoc: new gsd.Model.Document({  
    child_nodes: [
      // TODO: create paragraphs by default (when passing vanilla objects)
      // TODO: support passing string directly
      new gsd.Model.Paragraph({content: "This is the first paragraph."}),
      new gsd.Model.Paragraph({content: "So that makes this the second paragraph"})
    ]
  }),
  
  saveDocument: function() {
    console.log('saveDocument');
    
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
    /*
    ajax('/api/articles/new_uuid')
      .then( function(data) {
        console.log('new_uuid as promised:', data);
      })
    */
    console.log('this.newdoc:', JSON.stringify(this.newdoc));
    
    ajax('/api/articles', {
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(this.newdoc)
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

console.log('about to get list of articles');
ajax('/api/articles', { dataType: 'json' })
.then( function(result) {
  console.log('Index:', result);
  _.each(result, function(item) { console.log('item:', item); data.index.push(item); });
})
.fail( function(err) {
  alert('failed to obtain article list:' + err);
})
