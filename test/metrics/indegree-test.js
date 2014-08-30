var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("indegree", function() {
    var data = {
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

    var result = Kraken.graph(data).collect("indegree", true);
    assert.deepEqual(result, {one: 2, two: 2, three: 1, four: 0});
  });
});
