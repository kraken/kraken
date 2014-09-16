var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("#reach()", function() {
    var graph = Kraken()
      .add("a")
      .add("b")
      .add("c")
      .add("d")
      .connect("a", "b")
      .connect("b", "a")
      .connect("b", "c")
      .connect("b", "d");

    var a = graph.get("a");
    var b = graph.get("b");
    var c = graph.get("c");

    assert.equal(a.reach(0), 1/4);
    assert.equal(a.reach(1), 1/2);
    assert.equal(a.reach(2), 1);
    assert.equal(a.reach(), a.reach(2)); // defaults to two-step reach
    assert.equal(b.reach(), 1);
    assert.equal(c.reach(), 1/4);
  });

  test("#reach() disconnected", function() {
    var graph = Kraken().add("a").add("b");
    assert.equal(graph.get("a").reach(), 0.5);
    assert.equal(graph.get("a").reach(3), 0.5);
  });
});
