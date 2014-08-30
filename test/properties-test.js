var assert = require("assert");
var Kraken = require("./kraken");

suite("weight()", function() {
  test("sets weight value", function() {
    var graph = Kraken.graph()
      .add("one")
      .weight(0.1);

    assert.equal(graph.get("one").prop("weight"), 0.1);
  });

  test("can copy weight from another property", function() {
    var graph = Kraken.graph()
      .add({id: "one", length: 1.5})
      .weight("length");

    assert.equal(graph.get("one").prop("weight"), 1.5);
  });

  test("can set weight via callback", function() {
    var graph = Kraken.graph()
      .add({id: "one", length: 1.5})
      .weight(function(component) { return 0.9; });

    assert.equal(graph.get("one").prop("weight"), 0.9);
  });
});

suite("calc()", function() {
  test("allows custom property name", function() {
    var graph = Kraken.graph().add("one");
    graph.calc("degree", {as: "degree-1"});
    assert.deepEqual(graph.get("one").properties, {id: "one", "degree-1": 0});
  })
})

suite("collect()", function() {
  test("can be called with expression", function() {
    var graph = Kraken.graph().add({id: "one", followers: 2});
    var result = graph.collect("rank", "followers^3");
    assert.deepEqual(result, {one: 8});
  })

  test("returns values keyed by id", function() {
    var graph = Kraken.graph().add({id: "one", rank: 1});
    assert.deepEqual(graph.collect("rank"), {one: 1});
  });

  test("omits undefined values", function() {
    var graph = Kraken.graph().add({id: "one"});
    assert.deepEqual(graph.collect("rank"), {});
  });
});
