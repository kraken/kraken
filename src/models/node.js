var Set = require("collections/set");
var Entity = require("./entity");
var Dijkstra = require("../algorithms/dijkstra");

function Node(graph, properties) {
  Entity.call(this, graph, properties);
}

Node.prototype = Object.create(Entity.prototype);
Node.prototype.constructor = Node;
Node.prototype.type = "node";
Node.prototype.node = true;

Node.prototype.remove = function() {
  this.graph.remove(this);
  return this;
}

Node.prototype.connect = function(target, edge) {
  this.graph.connect(this, target, edge);
  return this;
}

// Neighborhood size
// Returns the number of nodes connected to node plus the node itself
Node.prototype.size = function() {
  var nodes = new Set();

  this.edges().forEach(function(edge) {
    nodes.add(edge.source());
    nodes.add(edge.target());
  });

  nodes.add(this);

  return nodes.length;
}

// TODO: insize/outsize

// Neighborhood ties
// Returns the number of edges for the node
Node.prototype.ties = function() {
  return this.graph.getEdgeCountFor(this);
}

// Neighborhood pairs
// Assumes directed graph
Node.prototype.pairs = function() {
  var n = this.size();
  return n * (n - 1);
}

// Neighborhood density
Node.prototype.density = function() {
  return this.ties() / this.pairs();
}

// Defaults to two-step reach if distance undefined
Node.prototype.reach = function(distance, visited) {
  if (distance === 0) return 0;

  var reach = 0;
  var self = this;
  var adjust = !visited;

  // Default to two-step reach
  distance = distance || 2;

  visited = visited || new Set();
  visited.add(self);

  this.edges().forEach(function(edge) {
    var target = edge.target();

    if (target !== self && !visited.has(target)) {
      visited.add(target);
      reach += 1 + target.reach(distance - 1, visited);
    }
  });

  if (adjust) {
    var order = this.graph.order();

    if (order > 1) {
      reach = reach / (order - 1);
    } else {
      reach = 0;
    }
  }

  return reach;
}

Node.prototype.reachEfficiency = function() {
  return this.reach(2) / this.size();
}

// Uses a modified approach to calculating closeness that works with
// disconnected graphs. Cloneness is defined as the sum of inversed distances
// to all other nodes.
//
// http://toreopsahl.com/2010/03/20/closeness-centrality-in-networks-with-disconnected-components/
Node.prototype.closeness = function() {
  var self = this;
  var graph = this.graph;
  var closeness = 0;

  graph.nodes().each(function(node) {
    var distance = self.distanceTo(node);

    if (distance !== 0) {
      closeness += 1 / distance;
    }
  });

  // normalize values between 0 and 1
  // NOTE: This will not work for edge weights other than 1
  closeness = closeness / (graph.order() - 1);

  return closeness;
}

// Defined as the inverse of closeness
// TODO: Should we be using the raw closeness value instead?
Node.prototype.farness = function() {
  return 1 / this.closeness();
}

Node.prototype.distance = function(node) {
  return Math.min(this.distanceTo(node), this.distanceFrom(node));
}

Node.prototype.distanceTo = function(node) {
  return this.graph.getDistance(this, node);
}

Node.prototype.distanceFrom = function(node) {
  return this.graph.getDistance(node, this);
}

Node.prototype.neighbors = function() {
  var nodes = new Set();

  this.edges().forEach(function(edge) {
    nodes.add(edge.source());
    nodes.add(edge.target());
  });

  nodes.add(this);

  return nodes.length;
}

Node.prototype.outNeighbors = function() {
  return this.graph.find(":out-neighbors", this).filter(filter);
}

Node.prototype.outNeighborCount = function() {
  return this.graph.getOutNeighborCount(this);
}

Node.prototype.inNeighbors = function(filter) {
  return this.graph.find(":in-neighbors", this).filter(filter);
}

Node.prototype.inNeighborCount = function() {
  return this.graph.getInNeighborCount(this);
}

Node.prototype.degree = function() {
  return this.graph.getEdgeCountFor(this);
}
Node.prototype.getEdgeCount = Node.prototype.degree;

Node.prototype.indegree = function() {
  return this.graph.getInEdgeCountFor(this);
}
Node.prototype.getInEdgeCount = Node.prototype.indegree;

Node.prototype.outdegree = function() {
  return this.graph.getOutEdgeCountFor(this);
}
Node.prototype.getOutEdgeCount = Node.prototype.outdegree;


// return this.graph.find(":edges", this).filter(filter);
Node.prototype.edges = function() {
  return this.graph.getEdgesFor(this);
}

Node.prototype.outEdges = function() {
  return this.graph.getOutEdgesFor(this);
}

// Node.prototype.inEdges = function() {
//   return this.graph.find(":in-edges", this).filter(filter);
// }

// Node.prototype.outEdges = function() {
//   return this.graph.find(":out-edges", this).filter(filter);
// }

Node.prototype.hasEdgeTo = function(node) {
  return this.graph.hasEdgeBetween(this, node);
}

Node.prototype.hasEdgeFrom = function(node) {
  return this.graph.hasEdgeBetween(node, this);
}

// Aliases
Node.prototype.in = Node.prototype.inEdges;
Node.prototype.out = Node.prototype.outEdges;


module.exports = Node;
