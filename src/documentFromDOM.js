"use strict";

function documentFromDOM(root_element)
{
  console.log('DocumentController.fromDOM()');
  
  var doc = {};
  
  for (var child = root_element.firstChild; !!child; child = child.nextSibling) {
    console.log('child:', child);
    if (child.tagName === 'P') 
      doc.child_nodes.push( paragraphFromElement(child) );
    else
      throw new Error('unexpected element:' + child);
  }
  
  console.log('-> document:', doc);
  
  // TODO: store instead of returning ?
  return doc;
  
  //------------------
  
  function paragraphFromElement(p)
  {
    // TODO: a real implementation
    return new { content: $(p).text() };
  }
}

module.exports = documentFromDOM;