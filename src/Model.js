function Node()
{
}

function Container(params)
{
  Node.apply(this, params);
  
  params = params || {};
  
  this.child_nodes = params.child_nodes || [];
}

Container.prototype = new Node();

Container.prototype.appendParagraph = function(p)
{
  console.log('Node::appendParagraph');
  
  this.child_nodes.push( p );
}

function Document()
{
  Container.apply(this, arguments);
}

Document.prototype = new Container();

function Paragraph(params)
{
  Node.apply(this, arguments);
  
  params = params || {};
  
  this.content = params.content || '';
}

Paragraph.prototype = new Node();

module.exports = {
  
  Node: Node,
  
  Paragraph: Paragraph,
  
  Document: Document,
}