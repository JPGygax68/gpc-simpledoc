"use strict";

var Registry = require("./Registry");

// TODO: simpler form where node type needs to be specified only once

Registry.registerPlugin('document', 'toDOM', function(data) {
  
    var frag = document.createDocumentFragment();
    
    for (var i = 0; i < data.child_nodes.length; i ++) 
    {
      var child = data.child_nodes[i];
      frag.appendChild( elementFromParagraph(child) );
    } 

    return frag;

    //-----------------------
    
    function elementFromParagraph(p) {
      
      var el = document.createElement('p');
      // TODO: define and handle inline elements
      //console.log('p.content:', p.content);
      el.innerHTML = p.content;
      // Reference back to document element
      el._doc_elem = p;
      el._docelt_type = 'paragraph'; // necessary for event handling
      return el;
    }
  
});

Registry.registerPlugin('document', 'fromDOM', function(container) {

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
        if (child._docelt_type === 'paragraph') {
          doc.child_nodes.push( paragraphFromElement(child) );
        }
        else if (child.tagName === 'P') {
          doc.child_nodes.push( paragraphFromElement(child) );
          console.warn('document fromDom(): compatibility conversion: P -> paragraph (without explicit doc element type)');
        }
        else
          throw new Error('unexpected element:' + child);
      }
    //}
    
    return doc;
    
    //------------------
    
    function paragraphFromElement(cont_elem) {
      
      return {
        content: nodeToText(cont_elem)
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
          else if (node.nodeType == 3) 
            text += node.nodeValue;
          else
            throw new Error("nodeToText(): unsupported node type");
        }
        return text;
      }
    }
});

Registry.registerPlugin('paragraph', 'onEnteredProxy', function(dom_elem) {
  // dom_elem: DOM element representing the paragraph
  
  console.log('paragraph onEnteredBranch');
});

Registry.registerPlugin('paragraph', 'onLeftProxy', function(dom_elem) {
  // dom_elem: DOM element representing the paragraph
  
  console.log('paragraph onLeftBranch');  
});