
var is = require("is");
var assert = require("assert");
var delegate = require("delegates");
var utils = require("../utils");
var events = require("events");
var Node = require("./node");
var Edge = require("./edge");
var GraphIndex = require("../index/graph_index");
var Set = require("collections/set");
// var JohnsonsAllPairsShortestPaths = require("../algorithms/johnsons");
var Brandes = require("../algorithms/brandes");

//
// API
//  add({node_properties})
//  connect({edge_properties})
//  insert(node|edge)
//  remove(node|edge)
//  contains(node|edge|graph)
//  calculate(metric), alias calc
//  compute(property, expression or function), alias comp
//  pluck(prop[, prop...])
//  filter(selector[, context])
//  join(graph)
//  intersect(graph)
//  transform(...), alias x
//  clone()       // alias dup, shallow clone (shared properties)
//  deepClone()   // alias fork, deep clone (unique properties)
//  get(selector or id[, selector or id...]) // assumes unique, returns first match
//  find(selector[, context]) // returns WrappedSet
//  nodes()                   // returns WrappedSet
//  edges()                   // returns WrappedSet
//
// TODO: Which operations return new graph instances and which ones return
// a selection context?
//
// TODO: Does it make more sense to store adjacency centrally on the graph
// or separately on each node?
function Graph(data) {
  this.events = new events.EventEmitter();
  this.index = new GraphIndex(this);
  this.options = {
    directed: true,
    weighted: true,
    multi: true,
    strict: true,

    // Default edge id generator
    eid: function(source, target, properties) {
      return source.id + "-" + properties.type + "-" + target.id;
    }
  };

  // TODO: How could we hold onto a permanent kraken ref?
  // this.kraken = new Kraken(this);

  if (data) { this.import(data); }
}

//
// TODO: undirected and unweighted graphs can use much simpler and faster
// algorithms. For instance, Brandes' algorithm for betweenness deteriorates
// from O(nm) to O(nm + n^2logn) for weighted graphs.
//
// By default we should be able to calculate the metrics for any graph.
// Optimizations through simplification would be opt-in.
//
// See: http://en.wikipedia.org/wiki/Shortest_path_problem
//
Graph.prototype.directed = function(directed) {
  return this.option("directed", directed !== false)
}

Graph.prototype.weighted = function(weighted) {
  return this.option("weighted", weighted !== false)
}

// TODO: Automatically track whether the graph is a multi-graph instead.
// Can use multi(false) to disable multi graph support ahead of time and catch
// duplicate edges though.
Graph.prototype.multi = function(multi) {
  return this.option("multi", multi !== false)
}

Graph.prototype.strict = function(strict) {
  return this.option("strict", strict !== false);
};

Graph.prototype.option = function(name, value) {
  if (arguments.length === 2) {
    this.options[name] = value;
    return this;
  } else {
    return this.options[name];
  }
};

Graph.prototype.eid = function(source, target, properties) {
  if (arguments.length === 1) {
    var fn = source;
    this.options.eid = fn;
    return this;
  } else {
    return this.options.eid(source, target, properties);
  }
}

// Graph.prototype.nid = function(node) {
//   assert(false, "All nodes must include an explicit string id");
// }
//
// Graph.prototype.eid = function(edge, source, target) {
//   assert(false, "All edges must include an explicit string id");
// }

// Public: Adds the node to the graph.
// Can be called with single node definition or array of node definitions.
Graph.prototype.add = function(node) {
  if (is.array(node)) {
    var nodes = node;
    for (node in nodes) this.addNode(node);
  } else {
    this.addNode(node);
  }

  return this;
};

// Public: Adds edge between source and target with the given properties.
Graph.prototype.connect = function(sourceID, targetID, edge) {
  this.addEdge(sourceID, targetID, edge);
  return this;
};

// Public: Removes the given node/edge
Graph.prototype.remove = function(component) {
  this.index.remove(component);
  return this;
};

Graph.prototype.addNode = function(value) {
  var properties = is.object(value) ? value : {id: value};
  var node = new Node(this, properties);
  this.insertNode(node);
  return node;
};

Graph.prototype.addEdge = function(sourceID, targetID, value) {
  var source = this.get(sourceID) || this.addNodeLazy(sourceID);
  var target = this.get(targetID) || this.addNodeLazy(targetID);
  var properties = is.object(value) ? value : {type: value};
  properties.id = properties.id || this.eid(source, target, properties);
  var edge = new Edge(this, properties);

  // TODO: We originally didn't want to store the source and target on
  // the edge itself but doing so makes things a hell of a lot easier to follow.
  edge._source = source;
  edge._target = target;

  return this.insertEdge(source, target, edge);
};

Graph.prototype.addNodeLazy = function(id) {
  assert(!this.options.strict, "Node not found, " + id);
  return this.addNode(id);
};

Graph.prototype.insertNode = function(node) {
  this.index.addNode(node);
  return this;
};

Graph.prototype.insertEdge = function(source, target, edge) {
  assert(this.contains(source), "Source must exist in graph, " + source);
  assert(this.contains(target), "Target must exist in graph, " + target);
  this.index.addEdge(source, target, edge);
  return this;
};

Graph.prototype.update = function(component) {
  this.index.update(component);
  return this;
};

Graph.prototype.find = function(selector, context) {
  return Graph.find(this, selector || "*", context);
};

// Convenience finders
Graph.prototype.nodes = function() { return this.find("node"); };
Graph.prototype.edges = function() { return this.find("edge"); };

// Reverse all of the edges within the graph.
Graph.prototype.reverse = function() {
  this.index.reverse();
  return this;
};

Graph.prototype.weight = function(value) {
  this.find().weight(value);
  return this;
};

Graph.prototype.calc = function(property, expression) {
  this.find().calc(property, expression);
  return this;
};

Graph.prototype.eval = function(property, expression) {
  this.find().eval(property, expression);
  return this;
};

Graph.prototype.collect = function(property, expression) {
  return this.find().collect(property, expression);
};

// TODO: Allow data to be promise also
Graph.prototype.load = Graph.prototype.import = function(data) {
  this.importJSON(data);
  return this;
};

// undirected: 2 * E / (N * (N − 1))
// directed: E / (N * (N − 1))
Graph.prototype.density = function() {
  return this.size() / this.getCompleteSize();
}

// undirected: (N * (N-1)) / 2
// directed: N*(N-1)
Graph.prototype.getCompleteSize = function() {
  var order = this.order();
  return order * (order - 1);
};

// TODO: cache the calculation
Graph.prototype.shortestPaths = function() {
  return JohnsonsAllPairsShortestPaths(this);
}

// TODO: Cache
Graph.prototype.betweenness = function(options) {
  // return this.cache.betweenness || this.calculateBetweenness();
  return Brandes(this, options);
}

// Undirected: (N * (N-1)) / 2
// Directed: N*(N-1)
// Multigraph: Infinity
// Graph.prototype.getMaxSize = function() {
//   N*(N-1) is number of edges in directed graph. Number of edge in undirected graph is
// }


// Behave as an event emitter
delegate(Graph.prototype, "events")
  .method("addListener")
  .method("on")
  .method("once")
  .method("removeListener")
  .method("removeAllListeners")
  .method("setMaxListeners")
  .method("listeners")
  .method("emit")

// Only methods that require an intimate knowledge of the inner workings of
// the index should be delegated.  All others should be defined by the graph
// itself using the exposed api.
delegate(Graph.prototype, "index")
  .method("order")
  .method("size")
  .method("contains")
  .method("get")
  .method("getEdgeSource")
  .method("getEdgeTarget")
  .method("getEdgesFor")
  .method("getEdgeCountFor")
  .method("getInEdgesFor")
  .method("getInEdgeCountFor")
  .method("getOutEdgesFor")
  .method("getOutEdgeCountFor")
  .method("getDistance")
  .method("getEntityById")
  .method("getEntities")
  .method("getEntitiesByCollection")
  .method("getEntitiesByTag")
  .method("getEntitiesByType")
  .method("getEntitiesByLabel")
  .method("getEntitiesByProperty")
  .method("getEntitiesBySource")
  .method("getEntitiesByTarget");


module.exports = Graph;
