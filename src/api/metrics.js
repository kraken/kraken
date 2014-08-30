var is = require("is");
var assert = require("assert");
var math = require("mathjs")();
var Metrics = require("../static").metrics;
// var exports = module.exports = {};


// Delegates the getter method to the first item in the list.
function delegateGetter(method) {
  exports[method] = function() {
    var entity = this[0];
    return entity[method].apply(entity, arguments);
  };
}

delegateGetter("size");
delegateGetter("ties");
delegateGetter("pairs");
delegateGetter("reach");
delegateGetter("reachEfficiency");
delegateGetter("inreach");
delegateGetter("degree");
delegateGetter("indegree");
delegateGetter("outdegree");
delegateGetter("farness");

// TODO: Make all calculations async
// graph.calc("degree").then(function(result) { ... })
// graph.calc("rank", "a / b").then(...)
// graph.calc("rank", fn).then(...)
//
// TODO: How can we track progress?
exports.calc = function(property, expression) {
  var callback, options;

  // string expressions are simple component-based evaluations
  if (is.string(expression)) return this.eval(property, expression);

  // everything else is selection-based
  if (is.fn(expression)) {
    callback = expression;
  } else {
    var metric = property;

    if (is.object(expression)) {
      options = expression;
      property = expression.as;
    }

    callback = Metrics[metric];
    assert(callback, "Unknown metric, " + property);
  }

  // Metrics should use the resolve callback to resolve the computed
  // value for each component.
  var resolve = function(component, value) {
    component.prop(property, value);
  }

  // TODO: Should we pass the graph / selection explicitly here instead?
  callback.call(this, resolve, options);

  return this;
}

// We also support `collect(property, true)` to achieve the same behavior.
// Not sure which API we prefer yet.
exports.calcAndCollect = function(property, expression) {
  this.calc(property, expression);
  return this.pick(property);
}

// Expression can be a string-based property expression or a callback.
// Callback will be called for each component.
exports.eval = function(property, callback) {
  if (is.string(callback)) {
    var expr = math.compile(callback);
    callback = function(component) {
      return expr.eval(component.properties);
    }
  }

  this.each(function(component) {
    var value = callback(component);
    component.prop(property, value);
  });

  return this;
}
