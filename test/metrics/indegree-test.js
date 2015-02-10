var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  suite("indegree", function() {
    test("simple", function() {
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
    })

    test("weighted", function() {
      var data = {
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

      var result = Kraken.graph(data).collect("indegree", true);
      assert.deepEqual(result, {one: 5.5, two: 12, three: 4, four: 0});
    })
  })
})
