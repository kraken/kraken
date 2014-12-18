var MAX_ITERATIONS = 100;

var eigenvectorCentrality = function(resolve, options) {
  var v, w, s;
  var nodes = this.nodes();

  v = {};
  nodes.forEach(function(node) {
    v[node.id] = 1;
  });

  for (var i = 0; i < MAX_ITERATIONS; i++) {
    w = {};
    nodes.forEach(function(node) {
      w[node.id] = 0;
    });

    nodes.forEach(function(source) {
      source.outEdges().forEach(function(edge) {
        w[edge.target().id] += v[source.id];
      });
    });

    v = w;
    resolve.progress(i / MAX_ITERATIONS);
  }

  s = 0;
  nodes.forEach(function(node) {
    s += v[node.id];
  });

  nodes.forEach(function(node) {
    var centrality = v[node.id] / s;
    resolve(node, centrality);
  });

  resolve.progress(1);
};

module.exports = eigenvectorCentrality;
