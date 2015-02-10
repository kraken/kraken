var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  suite("ties", function() {
    test("simple", function() {
      var graph = Kraken.graph()
        .add("one")
        .add("two")
        .add("three")
        .connect("one", "two")
        .connect("one", "three")
        .calc("ties");

      assert.deepEqual(graph.collect("ties"), {one: 2, two: 1, three: 1});
    })

    test("weighted", function() {
      var graph = Kraken.graph()
        .add("one")
        .add("two")
        .add("three")
        .connect("one", "two", {weight: 10})
        .connect("one", "three")
        .calc("ties", {weighted: true});

      assert.deepEqual(graph.collect("ties"), {one: 11, two: 10, three: 1});
    })
  })
})
