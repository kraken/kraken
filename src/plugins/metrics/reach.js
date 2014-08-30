module.exports = function(degree) {
  return function(resolve, options) {
    this.eachNode(function(node) {
      resolve(node, node.reach(degree));
    });
  };
};
