var util = require("util");

function Collection() {
  // TODO: Optimize this for addition, removal, and iteration
  // For now we want collections to behave as arrays
  var models = [];
}

util.inherits(Collection, Array);

// Collection.prototype = Object.create(Array.prototype)
// Collection.prototype.constructor = Collection;

Collection.prototype.add = function(component) {
  return this.push(component);
}

Collection.prototype.remove = function(component) {
  var index = this.indexOf(component);
  return index == -1 ? this : this.splice(index, 1);
}

// TODO: Figure out why concat doesn't just work on its own
Collection.prototype.concat = function(collection) {
  return this.toArray().concat(collection.toArray());
}

Collection.prototype.toArray = function() {
  return this.slice(0);
}

module.exports = Collection;
