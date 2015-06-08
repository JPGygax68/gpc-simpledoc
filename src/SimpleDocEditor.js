"use strict";

var _ = require('underscore');
var $ = require('jquery');
var rangy = require('rangy');

//var Model = require('./Model');

/* The Widget class is a necessary evil: it creates the association between the
  view model proper, i.e. the document, and the state of the widget editing it.
 */
function SimpleDocEditor()
{
  var self = this;
  
  $(this.element)
    .addClass('gpc-simpledoc-editor')
    .attr('contenteditable', true)
    .on('keydown', function(e) {
      return self.onKeyDown(e);
    })
    .on('blur', function(e) {
      console.log('blur:', e);
      self.save(element);
    })
    .on('input', function(e) {
      console.log('input event:', e);
    })      
    
  console.log('DocumentController ctor:', this);
}

/* Must be called from the init() entry point of the custom binding.
 */
SimpleDocEditor.prototype.initialize = function(element)
  // element: DOM element being bound to
{
  this.element = element;
}

SimpleDocEditor.prototype.onKeyDown = function(e)
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

SimpleDocEditor.prototype.queueSave = function() 
{ 
  // TODO: block all input until the save is done ?
  window.setTimeout(function() { this.save(); }.bind(this), 1); 
}

SimpleDocEditor.prototype.load = function(doc)
{
  console.log('SimpleDocEditor::load()', doc);

  // TODO: make sure we're not throwing away a document already being edited
  
  //var frag = document.createDocumentFragment();
  var container = document.createElement('div');
  container.className = 'gpc-simpledoc-editor';
  container.contentEditable = true;
  
  for (var i = 0; i < doc.child_nodes.length; i ++) {
    var child = doc.child_nodes[i];
    container.appendChild( elementFromParagraph(child) );
  }
  
  this.element.innerHTML = '';
  this.element.appendChild(container);
  
  //-----------------------
  
  function elementFromParagraph(p)
  {
    var el = document.createElement('p');
    el.innerText = p.content;
    return el;
  }
}

SimpleDocEditor.prototype.getDocument = function()
{
  console.log('SimpleDocEditor::save()');
  
  var doc = {};
  
  for (var child = this.element.firstChild; !!child; child = child.nextSibling) {
    console.log('child:', child);
    if (child.tagName === 'P') 
      doc.child_nodes.push( paragraphFromElement(child) );
    else
      throw new Error('unexpected element:' + child);
  }
  
  console.log('-> document:', doc);
  
  return doc;
  
  //------------------
  
  function paragraphFromElement(p)
  {
    // TODO: a real implementation
    return new { content: $(p).text() };
  }
}

module.exports = SimpleDocEditor;