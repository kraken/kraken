var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  suite("density", function() {
    test("simple", function() {
      var graph = Kraken()
        .add("a")
        .add("b")
        .add("c")
        .connect("a", "b")
        .connect("a", "c")
        .calc("density");

      assert.deepEqual(graph.collect("density"), {a: 1/3, b: 0.5, c: 0.5});
    })
  })
})
