var Graph = require("../models/graph");
var slice = Array.prototype.slice;

function register(type, args) {
  if (type === "format") {
    registerFormat.apply(null, slice.call(arguments, 1));
  } else {
    throw new Error("Unknown extension point, " + type);
  }
}

// Graph#toX
// Graph#importX
function registerFormat(name, format) {
  var dump = format.dump || unsupportedOperation;
  var load = format.load || unsupportedOperation;

  Graph.prototype["to" + name] = function() {
    return dump(this);
  }

  Graph.prototype["import" + name] = function(data) {
    return load(this, data);
  }
}

function unsupportedOperation() {
  assert(false, "Operation not supported");
}

module.exports = register;
