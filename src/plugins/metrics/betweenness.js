module.exports = function(resolve, options) {
  var betweenness = this.graph.betweenness();

  this.eachNode(function(node) {
    resolve(node, betweenness.get(node));
  });
};
