var Kraken = require("../../kraken");

Kraken.fn.out = function(value) {
  // TODO: This would need to return a new match set. Do we expose that process
  // or provide a helper?
  this.each(function(node) {
    if (!node.node) { return; }

  });

  return this.push();
};
