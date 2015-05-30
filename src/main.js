"use strict";

var ko = require('knockout');

var DocumentController = require('./DocumentController');
var Model = require('./Model');

ko.bindingHandlers.gpcSimpleDocEditor = {
  
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    // This will be called when the binding is first applied to an element
    // Set up any initial state, event handlers, etc. here
    
    var controller = new DocumentController(element);
    
    controller.load( valueAccessor() );
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    // This will be called once when the binding is first applied to an element,
    // and again whenever any observables/computeds that are accessed change
    // Update the DOM element based on the supplied values here.
  }
};

var my_doc = new Model.Document({  
  child_nodes: [
    new Model.Paragraph({content: "This is the first paragraph."}),
    new Model.Paragraph({content: "So that makes this the second paragraph"})
  ]
});

window.onload = function() {
  ko.applyBindings(my_doc);
}