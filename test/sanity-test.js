var assert = require("assert");
var Kraken = require("./kraken");
var Sizzle = require("../src/query/sizzle");

test("metrics", function() {
  var metrics = Kraken.graph()
    .add("a")
    .add("b")
    .connect("a", "b")
    .collect("indegree", true);

  assert.equal(metrics["a"], 0);
  assert.equal(metrics["b"], 1);
});

// test("selectors", function() {
//   console.log(Sizzle.tokenize("#id"))

//   var graph = Kraken.graph()
//     .add("a")
//     .add("b")
//     .connect("a", "b");

//     // graph.find("#a:out(likes)")

//   assert.equal(graph.find("#a").count(), 1);
// });
