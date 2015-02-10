// The goal of this index is to quickly be able to tell if and how two nodes
// are connected.
//
// TODO: Right now we're storing the actual node and edge references. Would it
// be more efficient to just store ids instead?
//
// TODO: Can we use generators here and possibly a doubly-linked list to make
// the set efficient to iterate AND edit? Removals are expensive with the
// current array-based approach.
//
// TODO: Track edge confirmation?
function EdgeIndex() {
  this.by = {source: {}, target: {}, all: {}};
}

EdgeIndex.prototype.source = function(edge) {

};

EdgeIndex.prototype.target = function(edge) {

};

EdgeIndex.prototype.add = function(source, target, edge) {
  this.from(source).add(edge, target);
  this.to(target).add(edge, source);
  this.all(source).add(edge, target);
  this.all(target).add(edge, source);
};

EdgeIndex.prototype.remove = function(source, target, edge) {
  this.from(source).remove(edge, target);
  this.to(target).remove(edge, source);
  this.all(target).remove(edge, source);
  this.all(source).remove(edge, target);
};

// The edge itself does not store references to source and target so it's
// easy to reverse the graph.
EdgeIndex.prototype.reverse = function() {
  var tmp = this.by.source;
  this.by.source = this.by.target;
  this.by.target = tmp;
};

// has(source)
// has(null, target)
// has(source, target, edge)
//
// or
//
// hasEdgeFrom
// hasEdgeTo
// hasAnyAdge
EdgeIndex.prototype.has = function(edge) {

};

EdgeIndex.prototype.from = function(source, target) {
  var index = this.indexFor(source, "source");
  return target ? index.get(target) : index;
};

EdgeIndex.prototype.to = function(node) {
  return this.indexFor(node, "target");
};

// TODO: all(node, node) for all edges between
EdgeIndex.prototype.all = function(node) {
  return this.indexFor(node, "all");
};

EdgeIndex.prototype.indexFor = function(node, role) {
  var set = this.by[role][node.id] = this.by[role][node.id] || new EdgeSet()
  return set;
};


function EdgeSet(simple) {
  this.length = 0;
  this.edges = [];
  if (!simple) this.byNode = {};
}

EdgeSet.prototype.add = function(edge, node) {
  if (this.byNode) this.addEdgeForNode(edge, node);
  this.edges.push(edge);
  this.length++;
};

EdgeSet.prototype.remove = function(edge, node) {
  if (this.byNode) this.removeEdgeForNode(edge, node);
  this.edges.splice(this.edges.indexOf(edge), 1);
  this.length--;
};

EdgeSet.prototype.addEdgeForNode = function(edge, node) {
  var index = this.byNode[node.id] = this.byNode[node.id] || new EdgeSet(true);
  index.add(edge);
};

EdgeSet.prototype.removeEdgeForNode = function(edge, node) {
  this.byNode[node.id].remove(edge, node);
};

EdgeSet.prototype.get = function(node) {
  return this.byNode[node.id];
};

EdgeSet.prototype.forEach = function(fn, context) {
  return this.edges.forEach(fn, context);
};

EdgeSet.prototype.reduce = function() {
  return this.edges.reduce.apply(this.edges, arguments);
};

module.exports = EdgeIndex;
