// *
// node
// edge
// #id
// #id node
// #id:neighbors
// #id:out(1)

var Selectors = require("../static");

function universalSelector(graph) {
  return graph.getEntities();
}


function collectionSelector(graph, which) {
  return graph.getEntitiesByCollection(which + "s");
}

function select(context, selector) {
  var components, graph = context.graph;

  if (selector === "*") {
    components = universalSelector(graph)
  } else if (selector === "node" || selector === "edge") {
    components = collectionSelector(graph, selector);
  }

  return components;
}


module.exports = select;
