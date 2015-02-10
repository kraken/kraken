var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  suite("degree", function() {
    test("basic", function() {
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

    test("weighted", function() {
      var graph = Kraken()
        .add("one")
        .add("two")
        .add("three")
        .add("four")
        .connect("one", "two", {weight: 3})
        .connect("one", "three", {weight: 5})
        .connect("two", "one", {weight: 0.5})
        .connect("three", "two", {weight: 10});

      var degree = graph.collect("degree", true);

      assert.deepEqual(degree, {one: 8.5, two: 13.5, three: 15, four: 0});
    });
  })
});
