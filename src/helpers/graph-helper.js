// TODO: rewrite this with reduce once we added it.
// Not sure where else to put this stuff yet so for now I'm just trying to
// keep it out of the core.
var GraphHelper = {
  sumEdgeWeights: function(edges) {
    var sum = 0;
    edges.forEach(function(edge) {
      sum += edge.weight();
    });
    return sum;
  }
}

module.exports = GraphHelper;
