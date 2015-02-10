var assert = require("assert");
var Kraken = require("../kraken");

suite("serialization", function() {
  test("json can be loaded", function() {
    var json = {
      nodes: [
        1,
        2
      ],

      edges: [
        [1, 2, {weight: 0.99}]
      ]
    };

    var graph = Kraken(json);
    assert.equal(graph.nodes().length, 2);
    assert.equal(graph.edges().length, 1);
    assert.equal(graph.edges()[0].weight(), 0.99);
  });
});
