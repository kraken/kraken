var assert = require("assert");
var Kraken = require("../kraken");
var detectCommunities = require("../../src/algorithms/community-slpa");

suite("algorithms", function() {
  suite("community-slpa", function() {
    test("Kraken#communities", function() {
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

      var result = graph.communities();
      console.log("SLPA community detection");
      console.log(result);
      assert(result["a"][0] > 0);
    });

    test("it removes nested communities", function() {
      assert(false, "TODO");
    });
  });
});
