var assert = require("assert");
var Kraken = require("../kraken");
var Johnson = require("../../src/algorithms/johnson");

suite("algorithms", function() {
  suite("johnson", function() {
    test("basics", function() {
      var graph = Kraken()
        .add("a")
        .add("b")
        .add("c")
        .add("d")
        .add("e")
        .connect("a", "b")
        .connect("a", "c")
        .connect("b", "a")
        .connect("b", "c")
        .connect("b", "d")
        .connect("c", "d")
        .connect("d", "a")
        .connect("d", "e");

      var a = graph.get("a");
      var b = graph.get("b");
      var c = graph.get("c");
      var d = graph.get("d");
      var e = graph.get("e");

      var shortest = Johnson(graph);

      assert.equal(shortest.distance(a, a), 0);
      assert.equal(shortest.distance(c, a), 2);
      assert.equal(shortest.distance(a, e), 3);
      assert.equal(shortest.distance(e, a), Infinity);

      assert.equal(shortest.previous(a, a), undefined);
      assert.equal(shortest.previous(b, c), b);
      assert.equal(shortest.previous(d, b), a);
      assert.equal(shortest.previous(a, d), b);
    });
  });
});
