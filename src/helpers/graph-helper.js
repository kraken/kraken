// Not sure where else to put this stuff yet so for now I'm just trying to
// keep it out of the core.
var GraphHelper = {
  sum: function(collection, method) {
    return collection.reduce(function(total, model) {
      return total + model[method].call(model);
    }, 0);
  }
}

module.exports = GraphHelper;
