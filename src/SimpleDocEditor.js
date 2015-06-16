"use strict";

var _ = require('underscore');
var $ = require('jquery');
var rangy = require('rangy');
var Mousetrap = require('mousetrap');

var Converter = require('./Converter');

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

/* "Load" the specified SimpleDoc document into this editor.
  Mainly, this will create a DOM represention of the SimpleDoc document
  that is made editable via the contentEditable attribute + some supporting
  JS code.
 */
SimpleDocEditor.prototype.load = function(doc)
  // doc SimpleDoc document object
{
  console.log('SimpleDocEditor::load()', doc);

  var elem = Converter.dataToDOM(doc);
  
  this.container.innerHTML = '';
  this.container.appendChild(elem);
  
  this.doc = doc;
}

SimpleDocEditor.prototype.document = function() { return this.doc; }

/* Commit changes made in the DOM to the SimpleDoc object assigned to this 
  editor instance.
 */
SimpleDocEditor.prototype.commitChanges = function()
{
  console.log('SimpleDocEditor::commitChanges()');

  this.doc = Converter.domToData(this.container);
}

module.exports = SimpleDocEditor;