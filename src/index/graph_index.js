var is = require("is");
var assert = require("assert");
var Set = require("collections/set");
var Collection = require("./collection");
var EdgeIndex = require("./edge_index");
var ShortestPathTree = require("../models/shortest-path-tree");
var Johnson = require("../algorithms/johnson");
var Dijkstra = require("../algorithms/dijkstra");
var GraphHelper = require("../helpers/graph-helper");

// An Index represents the backbone of a graph.  It stores the graph structure
// and indexes the contents to enable efficient lookups.
function Index(graph) {
  // TODO: store each property as its own tree
  this.graph = graph;
  this.by = {id: {}};
  this.edges = new EdgeIndex();
  this.collections = {nodes: new Collection(), edges: new Collection()};
  this.shortest = new ShortestPathTree();

  this._order = 0; // number of nodes
  this._size = 0;  // number of edges
}

Index.prototype.order = function() { return this._order; }
Index.prototype.size = function() { return this._size; }

Index.prototype.addNode = function(node) {
  assert(!this.contains(node), "Node already exists, " + node);
  this.by.id[node.id] = node;
  this.collections.nodes.add(node);
  this._order += 1;
  this.shortest.reset();
}

Index.prototype.addEdge = function(source, target, edge) {
  assert(!this.contains(edge), "Edge already exists, " + edge);
  this.by.id[edge.id] = edge;
  this.edges.add(source, target, edge);
  this.collections.edges.add(edge);
  this._size += 1;
  this.shortest.reset();
}

Index.prototype.update = function(component) {

}

Index.prototype.remove = function(component) {
  if (component.type === "node")
    this.removeNode(component);
  else
    this.removeEdge(component);

  delete this.by.id[component.id];
}

Index.prototype.removeNode = function(node) {
  var self = this;

  // Remove all related edges
  this.edges.all(node).forEach(function(edge) {
    self.removeEdge(edge);
  });

  // Remove the node itself
  this.collections.nodes.remove(node);
  this._order -= 1;
  this.shortest.reset();
}

// TODO: invalidate related nodes?
Index.prototype.removeEdge = function(edge) {
  var source = edge.source(), target = edge.target();
  this.edges.remove(source, target, edge);
  this.collections.edges.remove(edge);
  this._size -= 1;
  this.shortest.reset();
}

Index.prototype.reverse = function() {
  this.edges.reverse();
  this.shortest.reset();
}

// Public: Returns the component with the given id.
// Can be called with id, properties object, or Component.
Index.prototype.get = function(id) {
  if (is.object(id)) id = id.id || id.get("id");
  return this.getEntityById(id);
}

// Public: Returns true if component is present.
Index.prototype.contains = function(component) {
  return !!this.get(component);
}

Index.prototype.getEdgeSource = function(edge) {
  // return this.edges.
}

Index.prototype.getEdgeTarget = function(edge) {

}

Index.prototype.getEdgesFor = function(node) {
  return this.edges.all(node) || [];
}

Index.prototype.getOutEdgesFor = function(node) {
  return this.edges.from(node) || [];
}

// alias
Index.prototype.getEdgesFrom = Index.prototype.getOutEdgesFor;

Index.prototype.getInEdgesFor = function(node) {
  return this.edges.to(node) || [];
}

// alias
Index.prototype.getEdgesTo = Index.prototype.getInEdgesFor;



Index.prototype.getEdgeCountFor = function(node) {
  return this.edges.all(node).length;
}

Index.prototype.getInEdgeCountFor = function(node) {
  return this.edges.to(node).length;
}

Index.prototype.getOutEdgeCountFor = function(node) {
  return this.edges.from(node).length;
}

Index.prototype.getWeightedEdgeCountFor = function(node) {
  return GraphHelper.sumEdgeWeights(this.edges.all(node));
}

Index.prototype.getWeightedInEdgeCountFor = function(node) {
  return GraphHelper.sumEdgeWeights(this.edges.to(node));
}

Index.prototype.getWeightedOutEdgeCountFor = function(node) {
  return GraphHelper.sumEdgeWeights(this.edges.from(node));
}

Index.prototype.getNeighbors = function(node) {
  return [];
}

Index.prototype.getNeighborCount = function(node) {
  return this.getNodeSize(node) - 1;
}

Index.prototype.getInNeighborCount = function(node) {
  return -1;
}

Index.prototype.getOutNeighborCount = function(node) {
  return -1;
}

Index.prototype.getDistance = function(source, target) {
  var distance = this.getCachedDistance(source, target);

  if (is.defined(distance)) {
    return distance;
  } else {
    return this.calcDistance(source, target);
  }
}

Index.prototype.getCachedDistance = function(source, target) {
  return this.shortest.distance(source, target);
}

// Right now we calculate all of source's shortest paths instead
// of just the ones to target, expecting additional queries to
// other targets. Values are cached until graph modification.
Index.prototype.calcDistance = function(source, target) {
  Dijkstra(this.graph, source, this.shortest);
  return this.getDistance(source, target);
}

// Use's Johnson's algorithm to compute all-pairs-shortest-paths.
// Values are cached until graph modification.
Index.prototype.calcShortestPaths = function() {
  Johnson(this.graph, this.shortest);
}


// which: nodes or edges
Index.prototype.getEntityById = function(id) { return this.by.id[id]; }
Index.prototype.getEntities = function() { return this.collections.nodes.concat(this.collections.edges); }
Index.prototype.getEntitiesByCollection = function(which) { return this.collections[which]; }
Index.prototype.getEntitiesByTag = function(tag) {}
Index.prototype.getEntitiesByType = function(type) {}
Index.prototype.getEntitiesByLabel = function(label) {}
Index.prototype.getEntitiesByProperty = function(prop, value) {}
Index.prototype.getEntitiesBySource = function(source) {}
Index.prototype.getEntitiesByTarget = function(target) {}


module.exports = Index;
