"use strict";

var gsd = require('gpc-simpledoc');
var ko = gsd.ko;

console.log("ko.bindingHandlers:", ko.bindingHandlers, ko.bindingHandlers.gpcSimpleDocEditor);

gsd.init();

var doc = new gsd.Model.Document({  
  child_nodes: [
    new gsd.Model.Paragraph({content: "This is the first paragraph."}),
    new gsd.Model.Paragraph({content: "So that makes this the second paragraph"})
  ]
})

console.log('doc:', doc);
ko.applyBindings(doc);
