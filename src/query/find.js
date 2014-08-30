var Kraken = require("../kraken");
var utils = require("../utils/utils");

function find(graph, selector, result) {
  var components;

  selector = selector || "*";
  result   = result   || Kraken(graph, selector);

  if (selector === "*") {
    // TODO: fix this
    components = graph.findByCollection("nodes");
  } else if (selector === "node") {
    components = graph.findByCollection("nodes");
  } else if (selector === "edge") {
    components = graph.findByCollection("edges");
  }

  if (components) {
    utils.transfer(components, result);
  } else {
    result.length = 0;
  }

  return result;
}

module.exports = find;
