var range = require("../utils").range;
var Kraken = require("../kraken");

function star(size) {
  var graph = Kraken();

  for (var i in range(size)) {
    graph.add(i);
    if (i != 1) graph.connect(0, i);
  }

  return graph;
}

module.exports = star;
