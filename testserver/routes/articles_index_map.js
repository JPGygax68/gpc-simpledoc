function (doc) 
  // This CouchDB map() function emits a row that contains, on top of the standard "rev" 
  // (revision) field, a specially computed "tagline" field that is computed from either
  // the document title when available or the content of the first paragraph otherwise.
{

  var tagline;
  
  if (typeof doc.title === 'string' && doc.title.length > 0) {
    tagline = doc.title;
  }
  else if (doc.child_nodes && doc.child_nodes.length > 0) {
    tagline = doc.child_nodes[0].content;
    if (tagline.length > 80) tagline = tagline.slice(0, 80) + "...";
  }
  else {
    tagline = '(unnamed/empty document)';
  }

  emit(doc._id, { rev: doc._rev, tagline: tagline });
}