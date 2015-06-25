"use strict";

var Registry = require("./Registry");

Registry.registerEventHandler('paragraph', 'onEnteredProxy', function(dom_elem) {
  // dom_elem: DOM element representing the paragraph
  
  console.log('paragraph onEnteredProxy');
});

Registry.registerEventHandler('paragraph', 'onLeftProxy', function(dom_elem) {
  // dom_elem: DOM element representing the paragraph
  
  console.log('paragraph onEnteredProxy');  
});

Registry.registerAction('convertToHeader', {
  
  keyboardShortcut: 'Control+H',
  
  /* TODO: passing the "current" proxy element may not be useful, if - for example -
    the selection spans multiple document elements.
   */
  procedure: function(proxy_elem) {
    console.log('convertToHeader:', proxy_elem);
    
    // TODO: check if action is applicable given the circumstances
    
    // TODO: define and use service method to create proxy element
    var header_elem = document.createElement('h1');
    header_elem._docelt_type = 'header';
    header_elem.innerHTML = proxy_elem.innerHTML;
    
    // TODO: define and use service method to manipulate proxy tree
    var parent = proxy_elem.parentNode;
    parent.replaceChild(header_elem, proxy_elem);
    
    // Indicate that the editor needs to update itself
    // TODO: define and use service method ?
    return {
      replacement_proxy: header_elem
    };
  }
  
});