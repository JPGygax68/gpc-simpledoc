"use strict";

var ko = require('knockout');
var _ = require('underscore');

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

function Node(args) {

  args = args || {};
  
  var self = this;
  
  this.isParagraph = ko.observable(false);
  
  this.dummy = 'dummy';
  this.child_nodes = ko.observableArray(args.child_nodes || []);
  
  this.onKeyDown = function(e) {
    console.log('Node.onKeyDown', e);
    return true; // allow default actiont to happen
  }
  
  this.onMouseOver = function(e) {
    console.log('Node.onMouseOver', e);
  }
}

function Paragraph(args) {
  
  Node.apply(this, arguments);

  this.isParagraph(true);
  
  args = args || {};
  
  this.text = ko.observable(args.text || 'default paragraph text');
}

Paragraph.prototype = new Node();
Paragraph.prototype.constructor = Paragraph;

function Document(args) {
  
  Node.apply(this, arguments);
}

Document.prototype = new Node();
Document.prototype.constructor = Document;

var my_data = new Document({

  child_nodes: [
    new Paragraph({
      text: 'This is a simple paragraph node'
    }),
    new Paragraph()
  ]
})

window.onload = function() {
  ko.applyBindings(my_data);
}