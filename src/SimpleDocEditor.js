"use strict";

// TODO: change the name, as the editor can adapt to multiple document definitions

var _ = require('underscore');
var $ = require('jquery');
var rangy = require('rangy');
var Mousetrap = require('mousetrap');

// TODO: the plugins should live in their own packages
require('./document');

//var Converter = require('./Converter');

var Registry = require('./Registry');
var document_toDOM = Registry.findPlugin('document', 'toDOM');
var document_fromDOM = Registry.findPlugin('document', 'fromDOM');

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
    
  // Key sequences (using Mousetrap)
  Mousetrap(this.container).bind('ctrl+ins t', function(e, keys) {
    console.log('not implemented yet: insert table', keys);
    e.preventDefault();
  }, 'keydown')
  
  console.log('SimpleDocEditor ctor:', this);
}

SimpleDocEditor.Registry = require('./Registry');

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
      //this.queueCommit();
    }
    return true;
  }
  else if (e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && e.keyCode === 45) {
    this.key_combination = ['^Ins']
  }
}

/*
SimpleDocEditor.prototype.queueCommit = function() 
{ 
  console.log('queueCommit');
  // TODO: block all input until the save is done ?
  window.setTimeout(function() { this.commitChanges(); }.bind(this), 1); 
}
*/

SimpleDocEditor.prototype.createNew = function()
{
  console.log('SimpleDocEditor::createNew()');
  
  // TODO: protect against discarding current document

  // TODO: this should not be done here, it's document type dependent anyway
  this.doc = {
    child_nodes: [ { content: '' } ]
  };
  
  this._initForDocument();
}

/* "Load" the specified SimpleDoc document into this editor.
  Mainly, this will create a DOM represention of the SimpleDoc document
  that is made editable via the contentEditable attribute + some supporting
  JS code.
 */
SimpleDocEditor.prototype.load = function(doc)
  // doc SimpleDoc document object
{
  console.log('SimpleDocEditor::load()', doc);

  this.doc = doc;
  
  this._initForDocument();
}

SimpleDocEditor.prototype.document = function() { return this.doc; }

/* Commit changes made in the DOM to the SimpleDoc object assigned to this 
  editor instance.
 */
SimpleDocEditor.prototype.commitChanges = function()
{
  console.log('SimpleDocEditor::commitChanges()');

  this.doc = document_fromDOM(this.container); // Converter.domToData(this.container);
}

SimpleDocEditor.prototype._initForDocument = function()
{  
  this.container.innerHTML = '';
  this.container.appendChild( document_toDOM(this.doc) );
  this._attachHighlighter();
}

SimpleDocEditor.prototype._attachHighlighter = function()
{
  this.block_highlight = $('<div class="block-highlight">')
    .offset( { top: 0, left: 0 } )
    .appendTo(this.container);  
}

module.exports = SimpleDocEditor;