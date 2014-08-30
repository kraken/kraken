var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("outdegree", function() {
    var network = {
      nodes: [
        "one",
        "two",
        "three",
        "four"
      ],

      edges: [
        ["one", "one"],
        ["one", "two"],
        ["one", "three"],
        ["two", "one"],
        ["three", "two"]
      ]
    };

    var result = Kraken.graph(network).collect("outdegree", true);
    assert.deepEqual(result, {one: 3, two: 1, three: 1, four: 0});
  });
});
