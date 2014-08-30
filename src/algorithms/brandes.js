var ShortestPathTree = require("../models/shortest-path-tree");
var Heap = require("collections/heap");
var FastMap = require("collections/fast-map");

function Brandes(graph) {
  var options = {normalize: true, endpoints: false, k: Infinity};
  var result = new FastMap();

  // if (graph.multi()) {
  //   graph = branderize(graph.clone());
  // }

  graph.nodes().each(function(source) {
    result.set(source, 0);
  });

  graph.nodes().each(function(source) {
    compute(source, graph, options, result);
  });

  if (options.normalize) normalize(graph, result);

  return result;
}

function compute(source, graph, options, result) {
  // TODO: Pretty sure we can reuse the shortest path tree
  // but resetting it will save us a lot of memory
  var shortest = new ShortestPathTree();
  var stack = [];

  // min priority queue
  // TODO: need to use fibonacci heap instead
  var queue = new Heap(null, null, function (u, v) {
    return shortest.distance(source, v) - shortest.distance(source, u);
  });

  // Initialization

  graph.nodes().each(function(target) {
    shortest.count(source, target, 0);
    shortest.dependency(source, target, 0);
    shortest.distance(source, target, Infinity);
  })

  shortest.count(source, source, 1);
  shortest.distance(source, source, 0);

  queue.push(source);

  var v;
  while ( (v = queue.pop()) ) {
    stack.push(v);

    v.outEdges().forEach(function(edge) {
      var w = edge.target();
      var d = shortest.distance(source, v) + edge.weight();

      // k-betweenness shortcircuit
      if (d > options.k) return;

      // Path discovery
      if (shortest.distance(source, w) > d) {
        shortest.count(source, w, 0); // TODO: 0 or 1?
        shortest.distance(source, w, d);
        shortest.previous(source, w, []);

        // Faster way to trigger resort?
        queue.delete(w); // might not be present
        queue.push(w);
      }

      // Path counting
      if (shortest.distance(source, w) === d) {
        var count = shortest.count(source, w) + shortest.count(source, v);
        shortest.count(source, w, count);

        // TODO: append, not replace, otherwise we only can recall the last path
        shortest.previous(source, w).push(v);
      }
    })
  }

  // accumulation
  if (options.endpoints) {
    result.set(source, result.get(source) + stack.length - 1);
  }

  while ( (w = stack.pop()) ) {
    var predecesors = shortest.previous(source, w);

    if (predecesors) predecesors.forEach(function(v) {
      var dep = shortest.dependency(source, v);
      var frequency = shortest.count(source, v) / shortest.count(source, w);

      // Erratum for edge weight/multiplicity:
      // http://www.inf.uni-konstanz.de/algo/publications/b-vspbc-08.pdf
      //
      // The accumulation part is missing from Alg. 11,
      // where a factor of ω(v,w) should be applied to σ[v]/σ[w].
      //
      // if (graph.multi()) {
      // frequency *= multiplicity(v, w);
      // }

      dep += frequency * (1 + shortest.dependency(source, w));

      // length-scaled betweenness
      // += frequency * (1 / shortest.distance(source, ?) + shortest.dependency(source, w));

      shortest.dependency(source, v, dep);
    });

    // TODO: linearly-scaled betweenness (builds on length-scaled)
    if (w !== source) {
      var betweenness = result.get(w) || 0;
      betweenness += shortest.dependency(source, w);

      if (options.endpoints) betweenness += 1;

      result.set(w, betweenness);
    }
  }
}

// Removes self-loops.
// Replaces duplicate edges in the same direction with a single edge.
// The edge weight is set to the lowest weight of all possible edges.
// The edge multiplicity is set to the number of lowest weight edges.
function branderize(graph) {

}

// undirected: 2/((n−1)(n−2))
// directed: 1/((n−1)(n−2))
function normalize(graph, result) {
  var n = graph.order();
  var normalizer = 1 / ((n - 1) * (n - 2));

  if (!graph.directed()) normalizer *= 2;

  result.forEach(function(value, node) {
    result.set(node, value * normalizer);
  });
}

module.exports = Brandes;
