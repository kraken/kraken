var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("density", function() {
    var graph = Kraken()
      .add("a")
      .add("b")
      .add("c")
      .connect("a", "b")
      .connect("a", "c");

    assert.equal(graph.get("a").density(), 1 / 3);
    assert.equal(graph.get("b").density(), 0.5);
    assert.equal(graph.get("c").density(), 0.5);
  });
});
