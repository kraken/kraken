var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("#reachEfficiency()", function() {
    var graph = Kraken()
      .add("a")
      .add("b")
      .add("c")
      .add("d")
      .connect("a", "c")
      .connect("b", "a")
      .connect("b", "c")
      .connect("b", "d");

    assert.equal(graph.get("a").reachEfficiency().toFixed(3), 0.167);
    assert.equal(graph.get("b").reachEfficiency().toFixed(3), 0.25);
  });

  test("#reachEfficiency() disconnected", function() {
    var graph = Kraken().add("a").add("b");
    assert.equal(graph.get("a").reachEfficiency(), 0.5);
  });
});
