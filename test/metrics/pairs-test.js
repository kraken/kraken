var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("#pairs()", function() {
    var graph = Kraken()
      .add("a")
      .add("b")
      .add("c")
      .add("d")
      .connect("a", "b")
      .connect("b", "c")
      .connect("b", "d");

    assert.equal(graph.get("a").pairs(), 2);
    assert.equal(graph.get("b").pairs(), 12); // defaults to 1
    assert.equal(graph.get("c").pairs(), 2);
    assert.equal(graph.get("d").pairs(), 2);
  });
});
