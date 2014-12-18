var uuid = require("../utils").uuid;
var FastMap = require("collections/fast-map");
var Dijkstra = require("./dijkstra");
var BellmanFord = require("./bellman-ford");
var ShortestPathTree = require("../models/shortest-path-tree");

function Johnson(graph) {
  var shortest = new ShortestPathTree();
  // var g = graph.clone();
  var q = graph.addNode(uuid());

  // Connect q to all other nodes with weight 0
  graph.nodes().each(function(target) {
    q.connect(target, {id: uuid(), weight: 0});
  });

  // Calculate shortest path distance from q to all other nodes
  BellmanFord(graph, q, shortest);

  // Adjust edge weights
  graph.edges().each(function(edge) {
    var source = edge.source();
    var target = edge.target();
    var weight = edge.weight();

    weight += shortest.distance(q, source) - shortest.distance(q, target);

    edge.weight(weight);
  });

  // Remove q and all related edges from the graph
  q.remove();

  // Reset shortest path calculations
  shortest.reset();

  // Calculate new shortest paths on original graph with adjusted weights
  graph.nodes().each(function(node) {
    Dijkstra(graph, node, shortest);
  });

  return shortest;
}

module.exports = Johnson;
