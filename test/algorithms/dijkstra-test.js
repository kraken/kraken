var assert = require("assert");
var Kraken = require("../kraken");
var Dijkstra = require("../../src/algorithms/dijkstra");

suite("algorithms", function() {
  suite("dijkstra", function() {
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

      var shortest = Dijkstra(graph, a);

      assert.equal(shortest.distance(a, a), 0);
      assert.equal(shortest.distance(a, b), 1);
      assert.equal(shortest.distance(a, c), 1);
      assert.equal(shortest.distance(a, d), 2);
      assert.equal(shortest.distance(a, e), 3);

      assert.equal(shortest.previous(a, a), undefined);
      assert.equal(shortest.previous(a, b), a);
      assert.equal(shortest.previous(a, c), a);
      assert.equal(shortest.previous(a, d), b);
      assert.equal(shortest.previous(a, e), d);
    });
  });
});
