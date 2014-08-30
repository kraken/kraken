var assert = require("assert");
var Kraken = require("../kraken");

suite.only("metrics", function() {
  test("degree", function() {
    var graph = Kraken()
      .add("one")
      .add("two")
      .add("three")
      .add("four")
      .connect("one", "one")
      .connect("one", "two")
      .connect("one", "three")
      .connect("two", "one")
      .connect("three", "two");

    var degree = graph.collect("degree", true);

    assert.deepEqual(degree, {one: 5, two: 3, three: 2, four: 0});
  });
});
