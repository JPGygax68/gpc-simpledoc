"use strict";

var Registry = require("./Registry");
require('./paragraph');

// TODO: simpler form where node type needs to be specified only once

Registry.registerEventHandler('document', 'toDOM', function(data) {
  
    var frag = document.createDocumentFragment();
    
    for (var i = 0; i < data.child_nodes.length; i ++) {
      var child = data.child_nodes[i];
      frag.appendChild( createProxy(child) );
    } 

    return frag;

    //-----------------------
    
    function createProxy(elem) {

      var proxy;
      
      if (elem.type === 'paragraph' || !elem.type) {
        proxy = document.createElement('p');
        // TODO: define and handle inline elements
        //console.log('p.content:', p.content);
      }
      else if (elem.type === 'header') {
        proxy = document.createElement('h1');
      }
      else
        throw new Error('unknown/unsupported document element type "'+elem.type+'"');

      proxy.innerHTML = elem.content;
      
      // Reference back to document element
      proxy._doc_elem = elem;
      proxy._docelt_type = elem.type; // necessary for event handling
      
      return proxy;
    }
  
});

Registry.registerEventHandler('document', 'fromDOM', function(container) {

    var doc = {
      child_nodes: []
    };
    
    /*
    // Single paragraph (first child is a text node) ?
    if (container.firstChild && container.firstChild.nodeType == 3) 
    {
      
    }
    else // Multiple paragraphs
    {
      */
      for (var child = container.firstChild; !!child; child = child.nextSibling) 
      {
        // TODO: use existing document element in child._doc_elem when available ?
        // ... unless they were changed!
        doc.child_nodes.push( elementFromProxy(child) );
      }
    //}
    
    return doc;
    
    //------------------
    
    function elementFromProxy(proxy) {
      
      return {
        type: proxy._docelt_type,
        content: nodeToText(proxy)
      };

      //------------
      
      function nodeToText(cont_elem) {
        
        var text = '';
        for (var node = cont_elem.firstChild; !!node; node = node.nextSibling) 
        {
          if (node.nodeType == 1) {
            // TODO: handle differences between browsers
            // TODO: callbacks for special handling
            text += nodeToText(node) // recurse
          }
          else if (node.nodeType == 3) {
            text += node.nodeValue;
          }
          else
            throw new Error("nodeToText(): unsupported node type");
        }
        return text;
      }
    }
});
