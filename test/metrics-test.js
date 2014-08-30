var assert = require("assert");
var Kraken = require("./kraken");

suite("degree", function() {
  test("metrics can be calculated", function() {
    var graph = Kraken.graph().add("one");
    var nodes = graph.nodes();
    nodes.calc("degree");
    assert.equal(nodes.min("degree"), 0);
    assert.equal(nodes.max("degree"), 0);
    assert.equal(nodes.avg("degree"), 0);
    assert.deepEqual(nodes.collect("degree"), {one: 0});
  });

  test("metrics can be defined inline", function() {
    var graph = Kraken.graph()
    graph.add({id: "one", followerCount: 10, followingCount: 5});

    graph.nodes().calc("popularity", function(resolve, options) {
      this.eachNode(function(node) {
        resolve(node, node.prop("followerCount") / node.prop("followingCount"));
      })

      return this;
    })

    // For simple inline calculations just use `each` instead:
    // graph.nodes().each(function(node) {
    //   node.prop("popularity", node.prop("followerCount") / node.prop("followingCount"));
    // });

    assert.equal(graph.nodes().prop("popularity"), 2);
  });

  test("metrics can be defined via expressions", function() {
    var graph = Kraken.graph()
    graph.add({id: "one", followerCount: 10, followingCount: 5});
    graph.nodes().calc("popularity", "followerCount / followingCount");

    assert.equal(graph.nodes().prop("popularity"), 2);
  });
});
