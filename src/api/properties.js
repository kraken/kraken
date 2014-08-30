var is = require("is");
var assert = require("assert");
var exports = module.exports = {};

// Get / set property on the selection.
exports.prop = function(property, value) {
  if (arguments.length === 1) return this[0].prop(property);

  this.each(function(component) {
    component.prop(property, value);
  });

  return this;
}

exports.copy = function(sourceProperty, targetProperty) {
  this.each(function(component) {
    var value = component.prop(sourceProperty);
    component.prop(targetProperty, value);
  })
  return this;
}

// rename?
// exports.move = function(sourceProperty, targetProperty) {
//
// }

// Custom getters / setters
exports.tag = function(value) {

}

exports.type = function(value) {

}

exports.label = function(value) {

}

exports.removeType = function() { return this.removeProp("type"); }
exports.removeLabel = function() { return this.removeProp("label"); }
exports.removeTags = function() { return this.removeProp("tags"); }
exports.removeTag = function(value) {

}

exports.removeProp = function(property) {
  return this.prop(property, undefined);
}

// TODO: Possible to allow value to be property or mathematical expression?
exports.weight = function(value) {
  if (is.fn(value)) {
    var callback = value;
    this.eval("weight", callback);
  } else if (is.string(value)) {
    var property = value;
    this.copy(property, "weight");
  } else {
    this.prop("weight", value);
  }

  return this;
}

exports.sortBy = function(property) {

}

exports.pick = function(property) {
  var values = {};
  this.each(function(component) {
    var value = component.prop(property);
    if (value !== null && value !== undefined) values[component.id] = value;
  });
  return values;
}

// Passing an expression to `collect` is a shorthand for calling
// `calc(prop, expr).collect(prop)`. It behaves similar to `pick`, however
// the property can be evaluated.
//
// Pass `true` for the expression to force the property to be recalculated.
//
// Undefined values are omitted from the results.
// TODO: What about NaN?
exports.collect = function(property, expression) {
  if (expression === true) {
    this.calc(property);
  } else if (expression) {
    this.calc(property, expression);
  }

  return this.pick(property);
}

exports.pluck = function(property) {
  return this.map(function(component) {
    return component.prop(property);
  }).toArray();
}

// exports.normalize = function(property) {}
