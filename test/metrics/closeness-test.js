var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("closeness", function() {
    var graph = Kraken()
      .add("a")
      .add("b")
      .add("c")
      .add("d")
      .add("e")
      .add("f")
      .connect("a", "b")
      .connect("b", "c")
      .connect("c", "d")
      .connect("d", "e");

    assert.equal(graph.get("a").closeness().toFixed(3), 0.417);
    assert.equal(graph.get("b").closeness().toFixed(3), 0.367);
    assert.equal(graph.get("c").closeness().toFixed(3), 0.300);
    assert.equal(graph.get("d").closeness().toFixed(3), 0);
    assert.equal(graph.get("e").closeness().toFixed(3), 0);
    assert.equal(graph.get("f").closeness().toFixed(3), 0);
  });
});
