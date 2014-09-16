var fn = function(degree) {
  return function(resolve, options) {
    this.eachNode(function(node) {
      resolve(node, node.reach(degree));
    });
  };
};

fn.total = function() {
  return this.graph.order();
};

module.exports = fn;
