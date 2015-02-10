var is = require("is");
var assert = require("assert");
var Graph = require("./graph");

//
// API
//
//   has(prop)
//   get(prop)
//   set(prop, value)
//   unset(prop)
//
//   prop(prop[, value])
//   removeProp(prop)
//
//   push(prop)
//   pop(prop)
//
//   tag(tag)
//   untag(tag) or removeTag(tag)
//
//   calc(metric)
//   compute(prop, expression or function)
//
//   degree()
//   inDegree()
//   outDegree()
//   betweeness()
//   eigen()
//
//   ignore() ?
//   remove()

// Create a new Entity within `graph`.
function Entity(graph, properties) {
  // assert(is.a(graph, Graph), "Graph expected, given: " + graph);
  // assert(is.string(properties.id), "String id expected, given: " + properties.id);

  this.graph = graph;
  this.properties = properties;
  this.id = properties.id; // assumes id is constant
}

Entity.prototype.get = function(property, defaultValue) {
  var value = this.properties[property];
  return value || value === 0 ? value : defaultValue;
}

Entity.prototype.set = function(property, value) {
  this.properties[property] = value;
  return this;
}

Entity.prototype.prop = function(property, value) {
  return arguments.length === 1 ? this.get(property) :
                                  this.set(property, value);
}

// Returns the assigned edge weight or 1 if undefined.
//
// TODO: This approach violates the principle of least surprise.
// Might want to handle this on a case-by-case basis for each algorithm
// or set as default properties instead.
//
// TODO: Consider alternative graph.weight("prop") that can be used to set the
// property used for edge weights. This method would take that setting into
// account when determining edge weight.
propertyAccessor("weight", 1);

function propertyAccessor(prop, defaultValue) {
  Entity.prototype[prop] = function(value) {
    if (arguments.length === 0) {
      return this.get(prop, defaultValue);
    } else {
      return this.set(prop, value);
    }
  }
}

module.exports = Entity;
