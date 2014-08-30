var assert = require("assert");
var Kraken = require("../kraken");
var Brandes = require("../../src/algorithms/brandes");

suite("algorithms", function() {
  suite("brandes", function() {
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

      var result = Brandes(graph);

      console.log("Brandes' betweenness");

      result.forEach(function(value, node) {
        console.log(node.id, value);
      });
    });
  });
});
