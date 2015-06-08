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
  
  this.container = document.createElement('div');
  this.container.className = 'gpc-simpledoc-editor';
  this.container.contentEditable = true;

  $(this.container)
    .addClass('gpc-simpledoc-editor')
    .attr('contenteditable', true)
    .on('keydown', function(e) {
      return self.onKeyDown(e);
    })
    .on('blur', function(e) {
      console.log('blur:', e);
      //self.save(element); // TODO: save, but to temporary storage
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
  element.innerHTML = '';
  element.appendChild(this.container);
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

  var frag = document.createDocumentFragment();
  
  for (var i = 0; i < doc.child_nodes.length; i ++) {
    var child = doc.child_nodes[i];
    frag.appendChild( elementFromParagraph(child) );
  }
  
  this.container.innerHTML = '';
  this.container.appendChild(frag);
  
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
  
  var doc = {
    child_nodes: []
  };
  
  for (var child = this.container.firstChild; !!child; child = child.nextSibling) {
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
    return { content: $(p).text() };
  }
}

module.exports = SimpleDocEditor;