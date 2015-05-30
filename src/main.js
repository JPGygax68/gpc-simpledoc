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
  
  this.child_nodes = params.child_nodes || [];
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

DocumentController.prototype.load = function(doc)
{
  console.log('DocumentController::load()', doc);
  
  var frag = document.createDocumentFragment();
  
  for (var i = 0; i < doc.child_nodes.length; i ++) {
    var child = doc.child_nodes[i];
    console.log('child:', child);
    frag.appendChild( elementFromParagraph(child) );
  }
  
  this.element.innerHtml = '';
  this.element.appendChild(frag);
  
  //-----------------------
  
  function elementFromParagraph(p)
  {
    var el = document.createElement('p');
    el.innerText = p.content;
    return el;
  }
}

DocumentController.prototype.save = function()
{
  console.log('DocumentController::save()');
  
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
    
    var controller = new DocumentController(element);
    
    $(element)
      .addClass('gpc-simpledoc-editor')
      .attr('contenteditable', true)
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
      
    controller.load( valueAccessor() );
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    // This will be called once when the binding is first applied to an element,
    // and again whenever any observables/computeds that are accessed change
    // Update the DOM element based on the supplied values here.
  }
};

var my_doc = new Document({  
  child_nodes: [
    new Paragraph({content: "This is the first paragraph."}),
    new Paragraph({content: "So that makes this the second paragraph"})
  ]
});

window.onload = function() {
  ko.applyBindings(my_doc);
}