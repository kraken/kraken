var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  suite("outdegree", function() {
    test("simple", function() {
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
    })

    test("weighted", function() {
      var network = {
        nodes: [
          "one",
          "two",
          "three",
          "four"
        ],

        edges: [
          ["one", "one", {weight: 5}],
          ["one", "two", {weight: 3}],
          ["one", "three", {weight: 4}],
          ["two", "one", {weight: 0.5}],
          ["three", "two", {weight: 9}]
        ]
      };

      var result = Kraken.graph(network).collect("outdegree", true);
      assert.deepEqual(result, {one: 12, two: 0.5, three: 9, four: 0});
    })
  })
})
