"use strict";

var ko = require('knockout');
var _ = require('underscore');
var $ = require('jquery');

function wrap(elem, options) {
  
  if (ko.isObservable(elem)) {
    return elem;
  }
  else if (_.isArray(elem)) {
    return ko.observableArray(elem);
  }
  else if (_.isObject(elem)) {
    return elem;
  }
  else {
    if (_.isUndefined(elem) && !!options) elem = options.def_val;
    return ko.observable(elem);
  }
}

ko.bindingHandlers.gpcSimpleDocEditor = {
  
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        var value = ko.unwrap(valueAccessor());
        console.log('value:', value);
        $(element)
          .addClass('gpc-simpledoc-editor')
          .text(value.tagLine);
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever any observables/computeds that are accessed change
        // Update the DOM element based on the supplied values here.
    }
};

var my_doc = {
  
  tagLine: "My very first SimpleDoc document"
};

window.onload = function() {
  ko.applyBindings(my_doc);
}