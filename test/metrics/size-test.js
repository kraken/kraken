var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("size", function() {
    var graph = Kraken.graph()
      .add("one")
      .add("two")
      .add("three")
      .connect("one", "two");

    graph.calc("size");

    assert.equal(graph.get("one").size(), 2);
    assert.equal(graph.get("two").size(), 2);
    assert.equal(graph.get("three").size(), 1);
  });
});
