"use strict";

var Registry = require("./Registry");

// TODO: simpler form where node type needs to be specified only once

Registry.registerPlugin('document', 'toDOM', function(data) {
  
    var frag = document.createDocumentFragment();
    
    for (var i = 0; i < data.child_nodes.length; i ++) {
      var child = data.child_nodes[i];
      frag.appendChild( elementFromParagraph(child) );
    } 

    return frag;

    //-----------------------
    
    function elementFromParagraph(p)
    {
      var el = document.createElement('p');
      // TODO: define and handle inline elements
      //console.log('p.content:', p.content);
      el.innerHTML = p.content;
      return el;
    }
  
});

Registry.registerPlugin('document', 'fromDOM', function(container) {

    var doc = {
      child_nodes: []
    };
    
    for (var child = container.firstChild; !!child; child = child.nextSibling) {
      if (child.tagName === 'P') 
        doc.child_nodes.push( paragraphFromElement(child) );
      else
        throw new Error('unexpected element:' + child);
    }
    
    return doc;
    
    //------------------
    
    function paragraphFromElement(p)
    {
      // TODO: a real implementation
      // TODO: define and handle inline elements
      console.log('p.innerHTML:', p.innerHTML);
      return { content: p.innerHTML };
    }
});