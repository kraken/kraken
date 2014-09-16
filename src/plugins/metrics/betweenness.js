// TODO: Custom progress handling since the resolve approach won't cut it
var fn = function(resolve, options) {
  var betweenness;

  options = options || {};

  // Defer progress handling to the algorithm since that's where time is spent
  options.progress = function(value) {
    resolve.progress(value);
  }

  betweenness = this.graph.betweenness(options);

  this.eachNode(function(node) {
    resolve(node, betweenness.get(node));
  });
};

module.exports = fn;
