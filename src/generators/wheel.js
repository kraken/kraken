var range = require("../utils").range;
var Star = require("./star");

function wheel(size) {
  var graph = Star(size);

  for (var i in range(1, size - 1)) {
    graph.connect(i, i + 1);
  }

  // graph.connect(0, size - 1);

  return graph;
}

module.exports = wheel;
