var is = require("is");
var Set = require("collections/set");
var Entity = require("./entity");
var Dijkstra = require("../algorithms/dijkstra");
var GraphHelper = require("../helpers/graph-helper");

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
// Returns the number of nodes connected to node plus the node itself.
// Can be weighted.
Node.prototype.size = function(options) {
  var neighbors = this.neighbors();

  if (options && options.weighted) {
    return GraphHelper.weight(neighbors);
  } else {
    return neighbors.length;
  }
}

// TODO: insize/outsize

// Neighborhood ties
// Returns the total number of edges within a node's immediate network.
// Can be weighted.
Node.prototype.ties = function(options) {
  var edges = new Set();
  var neighbors = this.neighbors();

  neighbors.forEach(function(source) {
    source.outEdges().forEach(function(edge) {
      if (neighbors.has(edge.target())) edges.add(edge);
    });
  });

  if (options && options.weighted) {
    return GraphHelper.weight(edges);
  } else {
    return edges.length;
  }
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
// reach(1)
// reach(1, {nodeWeighted: true})
// reach(1, {edgeWeighted: true})
// reach({nodeWeighted: true}) // defaults to two-step
Node.prototype.reach = function(distance, options, reached) {
  if (is.object(distance)) {
    reached = options;
    options = distance;
    distance = undefined;
  }

  if (reached) {
    reached.nodes.add(this);

    if (distance > 0) {
      this.outEdges().forEach(function(edge) {
        reached.edges.add(edge);
        edge.target().reach(distance - 1, options, reached);
      });
    }
  } else {
    var reach, total;

    // Default to two-step reach
    if (!is.number(distance)) distance = 2;

    options = options || {};

    reached = {
      nodes: new Set(),
      edges: new Set()
    }

    this.reach(distance, options, reached);

    // Percentage of the total network
    if (options.nodeWeighted) {
      reach = GraphHelper.weight(reached.nodes);
      total = this.graph.order({weighted: true});
    } else if (options.edgeWeighted) {
      reach = GraphHelper.weight(reached.edges);
      total = this.graph.size({weighted: true});
    } else {
      reach = reached.nodes.length;
      total = this.graph.order();
    }

    return reach / total;
  }
}

Node.prototype.reachEfficiency = function(distance, options) {
  var reach, total;

  options = options || {};

  if (is.object(distance)) {
    options = distance;
    distance = undefined;
  }

  reach = this.reach(distance, options);

  if (options.nodeWeighted) {
    total = this.size({weighted: true});
  } else if (options.edgeWeighted) {
    total = this.ties({weighted: true});
  } else {
    total = this.size();
  }

  return reach / total;
}

// Calculate the harmonic closeness, defined as the sum of the inverted
// distances to all other nodes.
//
// http://www.academia.edu/3687032/Closeness_Centrality_Extended_To_Unconnected_Graphs_The_Harmonic_Centrality_Index
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
  // NOTE: This will not work for edge weights other than 1.
  // For that we need to sum all (positive) edge weights.
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

// TODO: should this always include the element itself or is that a
// separate concern for Node#size ?
Node.prototype.neighbors = function() {
  var nodes = new Set();

  this.edges().forEach(function(edge) {
    nodes.add(edge.source());
    nodes.add(edge.target());
  });

  nodes.add(this);

  return nodes;
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

Node.prototype.getEdgeCount = function() {
  return this.graph.getEdgeCountFor(this);
}

Node.prototype.getInEdgeCount = function() {
  return this.graph.getInEdgeCountFor(this);
}

Node.prototype.getOutEdgeCount = function() {
  return this.graph.getOutEdgeCountFor(this);
}

Node.prototype.degree = function() {
  return this.graph.getWeightedEdgeCountFor(this);
}

Node.prototype.indegree = function() {
  return this.graph.getWeightedInEdgeCountFor(this);
}

Node.prototype.outdegree = function() {
  return this.graph.getWeightedOutEdgeCountFor(this);
}

// return this.graph.find(":edges", this).filter(filter);
Node.prototype.edges = function() {
  return this.graph.getEdgesFor(this);
}

Node.prototype.outEdges = function() {
  // return this.graph.find(":out-edges", this).filter(filter);
  return this.graph.getOutEdgesFor(this);
}

Node.prototype.inEdges = function() {
  // return this.graph.find(":in-edges", this).filter(filter);
  return this.graph.getInEdgesFor(this);
}

Node.prototype.hasEdge = function(node) {
  return this.hasEdgeTo(node) || this.hasEdgeFrom(node);
}

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
