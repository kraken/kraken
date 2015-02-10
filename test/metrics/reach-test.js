var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  suite("reach", function() {
    test("simple", function() {
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
    })

    // weighted order = 7
    test("node weighted", function() {
      var graph = Kraken()
        .add({id: "a", weight: 2})
        .add({id: "b", weight: 0.5})
        .add({id: "c", weight: 1.5})
        .add({id: "d", weight: 3})
        .connect("a", "b")
        .connect("b", "a")
        .connect("b", "c")
        .connect("b", "d");

      var a = graph.get("a");
      var b = graph.get("b");
      var c = graph.get("c");

      assert.equal(a.reach(0, {nodeWeighted: true}), 2/7);
      assert.equal(a.reach(1, {nodeWeighted: true}), 2.5/7);
      assert.equal(a.reach(2, {nodeWeighted: true}), 1);
      assert.equal(b.reach({nodeWeighted: true}), 1);
      assert.equal(c.reach({nodeWeighted: true}), 1.5/7);
    })

    // weighted size = 15
    test("edge weighted", function() {
      var graph = Kraken()
        .add("a")
        .add("b")
        .add("c")
        .add("d")
        .connect("a", "b", {weight: 1})
        .connect("b", "a", {weight: 2})
        .connect("b", "c", {weight: 2})
        .connect("b", "d", {weight: 10});

      var a = graph.get("a");
      var b = graph.get("b");
      var c = graph.get("c");

      assert.equal(a.reach(0, {edgeWeighted: true}), 0);
      assert.equal(a.reach(1, {edgeWeighted: true}), 1/15);
      assert.equal(a.reach(2, {edgeWeighted: true}), 1);
      assert.equal(b.reach({edgeWeighted: true}), 1);
      assert.equal(c.reach({edgeWeighted: true}), 0);
    })

    test("disconnected", function() {
      var graph = Kraken().add("a").add("b");
      assert.equal(graph.get("a").reach(), 0.5);
      assert.equal(graph.get("a").reach(3), 0.5);
    })
  })
})
