var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  suite("ties", function() {
    test("simple", function() {
      var graph = Kraken.graph()
        .add("one")
        .add("two")
        .add("three")
        .add("four")
        .connect("one", "two")
        .connect("one", "three")
        .connect("two", "three")
        .connect("four", "three")
        .calc("ties");

      assert.deepEqual(graph.collect("ties"), {one: 3, two: 3, three: 4, four: 1});
    })

    test("weighted", function() {
      var graph = Kraken.graph()
        .add("one")
        .add("two")
        .add("three")
        .add("four")
        .connect("one", "two", {weight: 10})
        .connect("one", "three")
        .connect("two", "three")
        .connect("four", "three", {weight: 2})
        .calc("ties", {weighted: true});

      assert.deepEqual(graph.collect("ties"), {one: 12, two: 12, three: 14, four: 2});
    })
  })
})
