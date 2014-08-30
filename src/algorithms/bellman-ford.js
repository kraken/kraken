// The Bellman–Ford algorithm computes shortest paths from a single source to
// all other nodes in a weighted, directed graph.

var ShortestPathTree = require("../models/shortest-path-tree");

function BellmanFord(graph, source, shortest) {
  var nodes = graph.nodes();
  var n = nodes.length;

  shortest = shortest || new ShortestPathTree();

  nodes.each(function(target) {
    shortest.distance(source, target, target === source ? 0 : Infinity);
  });

  // n-1 times
  for (var i = 1; i < n; i++) {
    eachEdge(graph, function(edge, u, v, w) {
      var distance = shortest.distance(source, u) + w;

      if (shortest.distance(source, v) > distance) {
        shortest.distance(source, v, distance);
        shortest.previous(source, v, u);
      }
    });
  }

  eachEdge(graph, function(edge, u, v, w) {
    if (shortest.distance(source, u) + w < shortest.distance(source, v)) {
      throw new Error("Graph contains a negative-weight cycle");
    }
  });

  return shortest;
}

function eachEdge(graph, callback) {
  graph.edges().each(function(edge) {
    callback(edge, edge.source(), edge.target(), edge.weight());
  });
}


module.exports = BellmanFord;
