"use strict";

var ko = require('knockout');
var insertCss = require('insert-css');

var SimpleDocEditor = require('./SimpleDocEditor');

console.log('gpc-simpledoc: main.js (registers Knockout custom binding)');

/* Register the Knockout custom binding.
 */
ko.bindingHandlers.gpcSimpleDocEditor = {
  
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    // This will be called when the binding is first applied to an element
    // Set up any initial state, event handlers, etc. here
    
    var widget = valueAccessor().data || bindingContext.$data;
    widget.initialize(element);
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    // This will be called once when the binding is first applied to an element,
    // and again whenever any observables/computeds that are accessed change
    // Update the DOM element based on the supplied values here.

    var widget = valueAccessor().data || bindingContext.$data;
  }
};

module.exports = {
  
  init: function() {
    insertCss( require("./gpc-simpledoc.styl") );
  },

  Editor: SimpleDocEditor,
  //documentFromDOM: require('./documentFromDOM'),
  
  ko: ko,
  knockout: ko,
  jQuery: require('jquery')
}