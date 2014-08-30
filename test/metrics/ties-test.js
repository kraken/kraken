var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("ties", function() {
    var graph = Kraken.graph()
      .add("one")
      .add("two")
      .add("three")
      .connect("one", "two")
      .connect("one", "three");

    assert.equal(graph.get("one").ties(), 2);
    assert.equal(graph.get("two").ties(), 1);
    assert.equal(graph.get("three").ties(), 1);
  });
});
