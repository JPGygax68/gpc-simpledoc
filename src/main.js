"use strict";

var ko = require('knockout');
var _ = require('underscore');
var $ = require('jquery');
var rangy = require('rangy');

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

function Controller() {
}

Controller.prototype.save = function(element)
{
  console.log('Controller::save()', 'firstChild:', element.firstChild);
  for (var child = element.firstChild; !!child; child = child.nextSibling) {
    console.log('  child:', child.nodeType +':', child);
  }
}

Controller.prototype.onKeyDown = function(e)
  // e:       jQuery-wrapped keydown event
  // returns: return false will stop default action AND propagation (see jQuery)
{
  if (e.keyCode === 13) {
    var sel = rangy.getSelection();
    if (sel.isCollapsed) {
      console.log('selection is collapsed');
      // TODO: instead of using the deepest enclosing node, find the closest
      // ancestor that has "paragraph" level.
      var before = rangy.createRangyRange();
      before.setStartAndEnd(sel.anchorNode, 0, sel.anchorNode, sel.anchorOffset);
      var after = rangy.createRangyRange();
      after.setStart(sel.anchorNode, sel.anchorOffset);
      after.setEndAfter(sel.anchorNode);
      var part2 = after.extractContents();
      var part1 = before.extractContents();
      console.log(part1, part2);
      var range = rangy.createRangyRange();
      range.setStart(sel.anchorNode, 0);
      console.log(range);
      var p1 = document.createElement('p');
      p1.appendChild(part1);
      var p2 = document.createElement('p');
      p2.appendChild(part2);
      range.insertNode(p1);
      range.collapseAfter(p1);
      range.collapse();
      range.insertNode(p2);
      sel.setSingleRange(range);
    }
    return false;
  }
}

ko.bindingHandlers.gpcSimpleDocEditor = {
  
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        
        console.log('this:', this);
        
        var controller = new Controller();
        
        var value = ko.unwrap(valueAccessor());
        $(element)
          .addClass('gpc-simpledoc-editor')
          .attr('contenteditable', true)
          .append( $('<p>').text(value.tagLine) ) // TODO: real translation
          .on('keydown', function(e) {
            return controller.onKeyDown(e);
          })
          .on('blur', function(e) {
            console.log('blur:', e);
            controller.save(element);
          })
          .on('input', function(e) {
            console.log('input event:', e);
          })
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