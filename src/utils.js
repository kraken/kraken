var is = require("is");

// Use this to turn arguments into an array when a method can accept a
// single item, multiple items, or array of items.
exports.varg = function(args) {
  if (arguments.length > 1) {
    return args;
  } else {
    var firstArg = arguments[0];
    return is.array(firstArg) ? firstArg : [firstArg];
  }
}

// Transfers the source array's data to target
exports.transfer = function(source, target) {
  var length = target.length = source.length;

  for (var index = 0; index < length; index++) {
    target[index] = source[index];
  }

  return target;
}

// Usage:
// var nextID = require("utils").id;
// nextID()
//
// All nodes and edges get their own unique id.
var id = 1;
exports.id = function() { return id++; }


exports.range = function(a, b) {
  var n;
  var range = [];

  if (arguments.length === 1) {
    n = a;
    a = 0;
  } else {
    n = b - a + 1; // inclusive
  }

  for (var i = 0; i < n; i++) range.push(a + i);
  return range;
}
