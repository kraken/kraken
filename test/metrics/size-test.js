var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  suite("size", function() {
    test("simple", function() {
      var graph = Kraken.graph()
        .add("one")
        .add("two")
        .add("three")
        .connect("one", "two")
        .calc("size");

      assert.deepEqual(graph.collect("size"), {one: 2, two: 2, three: 1});
    })

    test("node weighted", function() {
      var graph = Kraken.graph()
        .add("one")
        .add("two", {weight: 10})
        .add("three")
        .connect("one", "two")
        .calc("size", {weighted: true})

      assert.deepEqual(graph.collect("size"), {one: 11, two: 11, three: 1});
    })

    // test("edge weighted", function() {
    //   var graph = Kraken.graph()
    //     .add("one")
    //     .add("two")
    //     .add("three")
    //     .connect("one", "two", {weight: 10});

    //   graph.calc("size");

    //   assert.equal(graph.get("one").size(), 11);
    //   assert.equal(graph.get("two").size(), 11);
    //   assert.equal(graph.get("three").size(), 1);
    // })
  })
})
