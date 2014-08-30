var Heap = require("collections/heap");
var ShortestPathTree = require("../models/shortest-path-tree");

function Dijkstra(graph, source, shortest) {
  shortest = shortest || new ShortestPathTree();

  // Min priority queue implementation for better performance
  //
  // TODO: Pretty sure we need to be using a fibonacci heap to get
  // the performance benefits here. This one is a binary heap.
  var queue = new Heap(null, null, function (u, v) {
    return shortest.distance(source, v) - shortest.distance(source, u);
  });

  graph.nodes().each(function(target) {
    shortest.distance(source, target, Infinity);
    queue.push(target);
  });

  shortest.distance(source, source, 0);

  var u;
  while ( (u = queue.pop()) ) {
    u.outEdges().forEach(function(edge) {
      var v = edge.target();

      if (queue.indexOf(v) != -1) {
        var distance = shortest.distance(source, u) + edge.weight();

        if (shortest.distance(source, v) > distance) {
          shortest.distance(source, v, distance);
          shortest.previous(source, v, u);

          // TODO: Is there a faster way to trigger a re-sort?
          queue.delete(v);
          queue.push(v);
        }
      }
    });
  }

  return shortest;
}


module.exports = Dijkstra;
