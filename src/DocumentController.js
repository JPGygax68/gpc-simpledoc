"use strict";

var _ = require('underscore');
var $ = require('jquery');
var rangy = require('rangy');

var Model = require('./Model');

/*  Top-level controller.
    More specialized controllers are probably needed, for special content (tables, code, etc.)
 */
function DocumentController(element, options)
{
  this.element = element;
  this.options = options || {};

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
  
  var newdoc = new Model.Document();
  
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
    return new Model.Paragraph({content: $(p).text()}); // TODO: a real implementation
  }
}

module.exports = DocumentController;