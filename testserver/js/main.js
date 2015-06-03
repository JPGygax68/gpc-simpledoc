"use strict";

var gsd = require('gpc-simpledoc');
var ko = gsd.ko;
//var ajax = require('component-ajax');
var ajax = require('jquery').ajax;

gsd.init();

var data = {
  
  doc: new gsd.Model.Document({  
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
    console.log('this.doc:', JSON.stringify(this.doc));
    
    ajax('/api/articles/store', {
      method: 'POST',
      //dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(this.doc)
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
