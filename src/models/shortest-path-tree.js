var FastMap = require("collections/fast-map");

function ShortestPathTree() {
  this._index = new FastMap();
}

ShortestPathTree.prototype.reset = function() {
  this._index.clear();
}

// Number of shortest paths from source to target
accessor("count");

// Distance of source to target
accessor("distance");

// Predecesors on the shortest paths from source to target
accessor("previous");

// Dependency of source on target
accessor("dependency");

ShortestPathTree.prototype._get = function(source) {
  var values = this._index.get(source);

  if (!values) {
    values = {
      count: new FastMap(),
      distance: new FastMap(),
      previous: new FastMap(),
      dependency: new FastMap()
    };

    this._index.set(source, values);
  }

  return values;
}

function accessor(name) {
  ShortestPathTree.prototype[name] = function(source, target, value) {
    var values = this._get(source);

    if (arguments.length === 3) {
      values[name].set(target, value);
      return this;
    } else {
      return values[name].get(target);
    }
  }
}

// TODO: Return shortest path from source to target
// ShortestPathTree.prototype.path = function(source, target) {}
//
// TODO: Return all shortest paths from source
// ShortestPathTree.prototype.paths = function(source) {}
//
// TODO: Return all shortest paths from source to target
// ShortestPathTree.prototype.paths = function(source, target) {}


module.exports = ShortestPathTree;
