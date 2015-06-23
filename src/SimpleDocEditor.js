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
var document_toDOM = Registry.findEventHandler('document', 'toDOM');
var document_fromDOM = Registry.findEventHandler('document', 'fromDOM');

class SimpleDocEditor {

  constructor(options)
  {
    var self = this;
    
    console.assert(options.default_block_element_type, "option \"default_block_element_type\" is mandatory!");
    
    this.options = options;
    
    // Root container
    this.root_cont = document.createElement('div');
    this.root_cont.className = 'gpc-simpledoc-editor';
    
    // Document container
    this.doc_cont = document.createElement('div');
    this.doc_cont.className = 'document-container';
    this.root_cont.appendChild(this.doc_cont);
    this.doc_cont.contentEditable = true;

    // Block highlighting div
    this.block_highlight = document.createElement('div');
    this.block_highlight.className = 'block-highlight';
    this.block_highlight.style.display = 'none';
    this.root_cont.appendChild(this.block_highlight);
      
    // Hook up event handlers
    $(this.doc_cont)
      .attr('contenteditable', true)
      .on('keydown', function(e) {
        self._queueUpdateFromBrowserState();
        return self.onKeyDown(e);
      })
      .on('mousedown', function(e) {
        self._queueUpdateFromBrowserState();
      })
      .on('blur', function(e) {
        console.log('blur:', e);
        //self.save(element); // TODO: save, but to temporary storage
      })
      .on('input', function(e) {
        console.log('input event:', e);
        // TODO: set a dirty flag
      })      
      
    // Key sequences (using Mousetrap)
    Mousetrap(this.doc_cont).bind('ctrl+ins t', function(e, keys) {
      console.log('not implemented yet: insert table', keys);
      e.preventDefault();
    }, 'keydown')
    
    this.handler_cache = {};
    
    this.curr_elem_proxy = null;
    
    console.log('SimpleDocEditor ctor:', this);
  }

  /* Must be called from the init() entry point of the custom binding.
   */
  initialize(element)
    // element: DOM element being bound to
  {
    this.element = element;
    element.innerHTML = '';
    element.appendChild(this.root_cont);
  }

  onKeyDown(e)
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

  createNew()
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
    Mainly, this will create a DOM representation of the SimpleDoc document
    that is made editable via the contentEditable attribute + some supporting
    JS code.
   */
  load(doc)
    // doc SimpleDoc document object
  {
    console.log('SimpleDocEditor::load()', doc);

    this.doc = doc;
    
    this._initForDocument();
  }

  document() { return this.doc; }

  /* Commit changes made in the DOM to the SimpleDoc object assigned to this 
    editor instance.
   */
  commitChanges() {
    
    console.log('SimpleDocEditor::commitChanges()');

    this.doc = document_fromDOM(this.doc_cont);
  }

  _initForDocument() {  
  
    rangy.getSelection().removeAllRanges(); // selection would otherwise stay inside removed DOM elements
    this.doc_cont.innerHTML = '';
    this.doc_cont.appendChild( document_toDOM(this.doc) );
    //this._queueUpdateFromBrowserState();
    this._synchronizeFromDOM();
  }

  _synchronizeFromDOM() {
    
    var self = this;
    
    // Find out where selection is by traversing upward
    var sel = rangy.getSelection(); // window.getSelection();
    var node = sel.anchorNode;
    var block_highlight_done = false;
    var elem_proxy = null;
    while (node && node !== this.doc_cont && node !== document.body) {
      if (!isDocElemProxy(node)) tryToMakeIntoDocElemProxy(node);
      if (isBlockElement(node)) {
        // TODO: support multiple levels of block elements ?
        if (!block_highlight_done) { 
          updateBlockHighlightPosition(node);
          block_highlight_done = true; 
        }
      }
      if (isDocElemProxy(node)) {
        elem_proxy = node;
      }
      node = node.parentNode;
    }
    
    // Did we end up at the doc_root node, or elsewhere ?
    // TODO: block highlight veto-able by onEnteredProxy handler ?
    if (node && node === this.doc_cont)
      $(this.block_highlight).show();
    else
      $(this.block_highlight).hide();
    
    // Did we move to a different document element ?
    if (elem_proxy !== this.curr_elem_proxy) {
      //console.log('new element proxy:', elem_proxy);
      // TODO: the "left proxy" event must not be raised we moved into a child
      if (!!this.curr_elem_proxy) this._callHandler(this.curr_elem_proxy, 'onLeftProxy'   );
      if (!!elem_proxy          ) this._callHandler(elem_proxy          , 'onEnteredProxy');
      this.curr_elem_proxy = elem_proxy;
    }
    
    //-------------
    
    function tryToMakeIntoDocElemProxy(node) {
      
      if (node.nodeType === 1) {
        var disp_type = getDisplayType(node);
        if (disp_type === 'block') node._docelt_type = self.options.default_block_element_type;
        // TODO: inline, inline-block, others ?
      }
    }
    
    function updateBlockHighlightPosition(node) {
      var p = $(node).position();
      var r = { left: p.left, top: p.top, width: $(node).innerWidth(), height: $(node).innerHeight() };
      $(self.block_highlight).css(r).show();
    }
    
    function isDocElemProxy(node) { return typeof (node._docelt_type) !== 'undefined'; }
    function isBlockElement(node) { return node.nodeType == 1 && getDisplayType(node) === 'block'; }
    function getDisplayType(node) { return window.getComputedStyle(node).getPropertyValue('display'); }
  }
  
  _queueUpdateFromBrowserState() {    
  
    var self = this;
   
    // TODO: mechanism that avoids unnecessary repetitions
    window.setTimeout( function() {
      self._synchronizeFromDOM();
    }, 50);
  }

  _callHandler(proxy_elem, event_name) {
    
    // TODO: implement element type inheritance ?
    
    console.log('_callHandler', proxy_elem, event_name);
    
    var events;
    if (!(events = this.handler_cache[proxy_elem._docelt_type])) 
      events = this.handler_cache[proxy_elem._docelt_type] = {};
    
    var handler = events[event_name];
    if (!handler) handler = Registry.findEventHandler(proxy_elem._docelt_type, event_name);
    
    if (!!handler) return handler.call(this, proxy_elem);
  }
}

// Static members

SimpleDocEditor.Registry = require('./Registry');


module.exports = SimpleDocEditor;