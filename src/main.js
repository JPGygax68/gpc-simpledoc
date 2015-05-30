"use strict";

var ko = require('knockout');
var _ = require('underscore');
var $ = require('jquery');
var rangy = require('rangy');

function Node()
{
}

function Container(params)
{
  Node.apply(this, params);
  
  params = params || {};
  
  this.child_nodes = [];
}

Container.prototype = new Node();

Container.prototype.appendParagraph = function(p)
{
  console.log('Node::appendParagraph');
  
  this.child_nodes.push( p );
}

function Document()
{
  Container.apply(this, arguments);
}

Document.prototype = new Container();

function Paragraph(params)
{
  Node.apply(this, arguments);
  
  params = params || {};
  
  this.content = params.content || '';
}

Paragraph.prototype = new Node();

/*  Top-level controller.
    More specialized controllers are probably needed, for special content (tables, code, etc.)
 */
function DocumentController(element, options)
{
  this.element = element;
  this.options = options || {};
}

DocumentController.prototype.save = function(element)
{
  console.log('DocumentController::save()', 'firstChild:', element.firstChild);
  for (var child = element.firstChild; !!child; child = child.nextSibling) {
    console.log('  child:', child.nodeType +':', child);
  }
}

DocumentController.prototype.onKeyDown = function(e)
  // e:       jQuery-wrapped keydown event
  // returns: return false will stop default action AND propagation (see jQuery)
{
  if (e.keyCode === 13) {
    var sel = rangy.getSelection();
    if (sel.isCollapsed) {
      this.queueSave();
    }
    return true;
  }
}

DocumentController.prototype.queueSave = function() 
{ 
  // TODO: block all input until the save is done ?
  window.setTimeout(function() { this.save(); }.bind(this), 1); 
}

DocumentController.prototype.save = function()
{
  console.log('save()', this);
  
  var newdoc = new Document();
  
  for (var child = this.element.firstChild; !!child; child = child.nextSibling) {
    console.log('child:', child);
    if (child.tagName === 'P') 
      newdoc.appendParagraph( paragraphFromElement(child) );
    else
      throw new Error('unexpected element:' + child);
  }
  
  console.log('document:', newdoc);
  
  //------------------
  
  function paragraphFromElement(p)
  {
    return new Paragraph({content: $(p).text()}); // TODO: a real implementation
  }
}

ko.bindingHandlers.gpcSimpleDocEditor = {
  
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        
        console.log('this:', this);
        
        var controller = new DocumentController(element);
        
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