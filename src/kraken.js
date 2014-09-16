// Inspired by jquery's wrapped set model
//
// http://www.keyframesandcode.com/resources/javascript/deconstructed/jquery/
//
// TODO: Add utility methods through one of the libs below. Preferably one that
// supports lazy evaluation and generators.
//
// Grunge: https://www.npmjs.org/package/grunge
// Lazy.js: http://danieltao.com/lazy.js
// Underscore: http://underscorejs.org
// Lo-dash: http://lodash.com/docs

// find
// closest
// nodes/edges/neighbors
// set/get/unset (attr?)
// filter
// reject
// each
// map
// every/some
// pluck
// first
// last
// eq/at
// connectTo(target)
// connectFrom(source)
// connectBy(prop)
// remove
// replaceWith
// sortBy
// groupBy
// countBy
// toArray

var is = require("is");
var extend = require("extend");
var utils = require("./utils");
var Graph = require("./models/graph");
var Entity = require("./models/entity");

function Kraken(graph, value, context) {
  if (arguments.length === 0) {
    return new Graph();
  } else if (!is.instance(graph, Graph)) {
    var data = graph;
    return new Graph(data);
  }

  if (!(this instanceof Kraken)) { return new Kraken(graph, value, context); }

  var self = this;
  this.graph = graph;
  this.selector = "";
  this.context = context;

  // [entities]
  if (is.array(value)) {
    var entities = value;
    entities.forEach(function(entity, index) {
      self[index] = entity;
    });
    self.length = entities.length;
    return this;
  }

  // selector
  if (is.string(value)) {
    this.selector = value;
    Kraken.find(graph, this.selector, this.context, this);
    return this;
  }
}

// TODO: context, selector, results instead?
// where context can be selection or graph?
Kraken.find = function(graph, value, context, result) {
  var entities;

  result = result || new Kraken(graph, value, context);

  if (is.string(value)) {
    entities = Kraken.select(result, value);
  } else if (is.array(value)) {
    entities = value;
  } else if (value instanceof Entity) {
    entities = [value];
  }

  if (entities) {
    utils.transfer(entities, result);
  } else {
    result.length = 0;
  }

  return result;
}

extend(Kraken, require("./static"));

Graph.find = Kraken.find;

Kraken.prototype = {};
Kraken.prototype.kraken = "[kraken object]";
extend(Kraken.prototype, require("./api/core"));
extend(Kraken.prototype, require("./api/properties"));
extend(Kraken.prototype, require("./api/statistics"));
extend(Kraken.prototype, require("./api/metrics"));
extend(Kraken.prototype, require("./api/traversal"));

// Allow selection prototype to be extended jQuery style
Kraken.fn = Kraken.prototype;

// Static api
Kraken.register = require("./plugins/register");
Kraken.graph    = function(data) { return new Graph(data); };

// Require core graph plugins
Graph.prototype.components = require("./plugins/graph/components");

// Require core formats
Kraken.register("format", "JSON", require("./plugins/formats/json"));

// TODO: Need a better way of defining metrics so they're added to the
// graph, the entity, and the selection.
// Kraken.register("metric", "degree", require(".."))
// Kraken.register("node:degree")
// Kraken.register("edge:degree")
// Kraken.register("graph:degree")

// Require core metrics
Kraken.metrics["size"]        = delegateMetricToMethod("size");
Kraken.metrics["ties"]        = delegateMetricToMethod("ties");
Kraken.metrics["pairs"]       = delegateMetricToMethod("pairs");
Kraken.metrics["density"]     = delegateMetricToMethod("density");
Kraken.metrics["degree"]      = delegateMetricToMethod("degree");
Kraken.metrics["indegree"]    = delegateMetricToMethod("indegree");
Kraken.metrics["outdegree"]   = delegateMetricToMethod("outdegree");
Kraken.metrics["farness"]     = delegateMetricToMethod("farness");
Kraken.metrics["closeness"]   = delegateMetricToMethod("closeness");
Kraken.metrics["betweenness"] = require("./plugins/metrics/betweenness");
Kraken.metrics["reach"]       = require("./plugins/metrics/reach")(2);
Kraken.metrics["reach1"]      = require("./plugins/metrics/reach")(1);
Kraken.metrics["reach2"]      = require("./plugins/metrics/reach")(2);
Kraken.metrics["reach3"]      = require("./plugins/metrics/reach")(3);
Kraken.metrics["reach-efficiency"] = delegateMetricToMethod("reachEfficiency")

function delegateMetricToMethod(methodName) {
  var fn = function(resolve, options) {
    this.eachNode(function(node) {
      var method = node[methodName];
      resolve(node, method.call(node));
    });
  };

  // allow progress to be calculated automatically
  fn.total = function() {
    return this.graph.order(); // number of nodes
  }

  return fn;
}

module.exports = Kraken;
