"use strict";

var ko = require('knockout');
var insertCss = require('insert-css');

var DocumentController = require('./DocumentController');
var Model = require('./Model');

console.log('gpc-simpledoc: main.js');

/* Register the Knockout custom binding.
 */
ko.bindingHandlers.gpcSimpleDocEditor = {
  
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    // This will be called when the binding is first applied to an element
    // Set up any initial state, event handlers, etc. here
    
    element._controller = new DocumentController(element);
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    // This will be called once when the binding is first applied to an element,
    // and again whenever any observables/computeds that are accessed change
    // Update the DOM element based on the supplied values here.

    element._controller.load( ko.unwrap(valueAccessor().data || bindingContext.$data) );
  }
};

module.exports = {
  
  init: function() {
    insertCss( require("./gpc-simpledoc.styl") );
  },
  
  Model: Model,
  
  ko: ko,
  knockout: ko,
  jQuery: require('jquery')
}