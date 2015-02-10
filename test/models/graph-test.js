var is = require("is");
var assert = require("assert");
var Kraken = require("../kraken");

suite("Graph", function() {
  test("#order", function() {
    var graph = Kraken.graph()
      .add({id: "a"})
      .add({id: "b", weight: 2});
    assert.equal(graph.order(), 2);
  })

  test("#order weighted", function() {
    var graph = Kraken.graph()
      .add({id: "a"})
      .add({id: "b", weight: 2});
    assert.equal(graph.order({weighted: true}), 3);
  })

  test("#size", function() {
    var graph = Kraken.graph()
      .add({id: "a"})
      .add({id: "b"})
      .connect("a", "b")
      .connect("b", "a", {weight: 2});
    assert.equal(graph.size(), 2);
  })

  test("#size weighted", function() {
    var graph = Kraken.graph()
      .add({id: "a"})
      .add({id: "b"})
      .connect("a", "b")
      .connect("b", "a", {weight: 2});
    assert.equal(graph.size({weighted: true}), 3);
  })

  test("#get(id) returns component", function() {
    var graph = Kraken.graph().add("one");
    assert(graph.get("one").node);
  });

  test("#getEdgeCountFor(node) returns total edge count for node", function() {
    var graph = Kraken.graph().add("one").add("two").connect("one", "two");
    var node = graph.get("one");
    assert.equal(graph.getEdgeCountFor(node), 1);
  });

  test("#getDistance(source, target) returns weighted distance between nodes", function() {
    var network = {
      nodes: ["one", "two", "three"],
      edges: [
        ["one", "two", {weight: 0.2}],
        ["two", "three"] // will assume weight of 1 if not given
      ]
    };

    var graph = Kraken.graph(network);
    var one = graph.get("one"), three = graph.get("three");
    assert.equal(graph.getDistance(one, three), 1.2);
  });

  // test("2", function() {
  //   var graph = Kraken.graph().add("one").add("two").add("three");
  //   var nodes = graph.nodes();
  //   assert.equal(graph.order(), 3);
  //   assert.equal(nodes.length, 3);
  //   assert.equal(nodes.first().prop("id"), "one");
  //   assert.equal(nodes.last().prop("id"), "three");
  //   assert.equal(nodes.at(1).prop("id"), "two");
  //   assert.deepEqual(nodes.pluck("id"), ["one", "two", "three"]);

  //   // nodes.first().prop("id")
  //   // nodes.first().prop("degree")
  //   // nodes.first().prop("degree", 3)

  // })

  // test("3", function() {
  //   var graph = Kraken.graph()
  //     .add("one")
  //     .add("two")
  //     .connect("one", "two", "likes");
  //   var edges = graph.edges();
  //   assert.equal(graph.order(), 2);
  //   assert.equal(graph.size(), 1);
  //   assert.equal(edges.length, 1);
  //   assert.deepEqual(edges.first().prop("id"), "one-likes-two");
  //   assert.deepEqual(edges.pluck("type"), ["likes"]);
  // });

  // test("4", function() {
  //   var graph = Kraken.graph()
  //     .add("one")
  //     .add("two")
  //     .eval("test", function(node) {
  //       return node.id === "one" ? 1 : 2;
  //     });
  //   var nodes = graph.nodes();
  //   // assert.deepEqual(graph.nodes().pick("test"), [{one: 1}, {two: 2}]);
  //   assert.deepEqual(nodes.pluck("test"), [1, 2]);
  //   assert.deepEqual(nodes.pick("test"), {one: 1, two: 2});
  //   // assert.deepEqual(graph.nodes()[0].pluck("test"), 1);
  // });

  // test("5", function() {
  //   var graph = Kraken.graph().connect("one", "two", "one-two");
  //   assert.equal(graph.nodes().calc("degree").pluck("degree"));
  //   // graph.nodes().calc("degree", function(node) { })
  //   assert.equal(graph.find("#one").prop("degree"), 1);
  //   assert.equal(graph.find("#one").degree(), 1);
  //   assert.equal(graph.find("#one").calc("degree"))
  //   // assert.equal(graph.find("#one").outDegree(), 1);
  //   // assert.equal(graph.find("#one").inDegree(), 0);
  // });

  // test("3", function() {
  //   var graph = new Graph()
  //     .add({id: "one", rank: 0.5})
  //     .add({id: "two", rank: 0.3})
  //     .add({id: "three", rank: 0.9});
  //
  //   assert(graph.find("[rank>0.5]").first().id == "three");
  //
  //   graph.nodes().sortBy("rank").top(1)
  //   assert(graph.nodes().sortBy("rank").top().id == "three");
  //   assert(graph.nodes().sortBy("rank").bottom().id == "three");
  //   assert.deepEqual(graph.nodes().sortBy("rank").top(3).pluck("id"), ["three", "one", "two"]);
  // })

  // suite("addNode(node)", function() {
  //   test("returns the node", function() {
  //     var graph = new Graph();
  //     var node = graph.addNode({});
  //     assert(node instanceof Node);
  //   })
  //
  //   test("adds the node to the graph", function() {
  //     var graph = new Graph();
  //     graph.addNode({});
  //     assert(graph.order == 1);
  //   })
  // })
  //
  // suite("find()", function() {
  //   test("returns matching components", function() {
  //     var data = {
  //       nodes: [
  //         {id: "one"}, // "one"
  //         {id: "two"}  // "two"
  //       ],
  //
  //       edges: [
  //         ["One", "Two", {id: "one-to-two"}] // "one-to-two"
  //       ]
  //     };
  //
  //     var graph = Graph.load(data);
  //     var set = graph.find("#one");
  //     var node = graph.find("#one").first(); // at(0)
  //
  //     // find
  //     assert(graph.find("#one").size == 1);
  //     assert(graph.find("#one").count == 1);
  //     assert(graph.find("#one").first instanceof Node);
  //     assert(graph.find("#one")[0] instanceof Node);
  //     assert.deepEqual(graph.find("#one").degree(), {id: 1});
  //     assert(graph.find("#one").calculate("degree").pluck("degree"), {id: 1});
  //     assert(graph.find("#one").calculate("indegree", "outdegree")).compute("popularity", "indegree/outdegree")
  //
  //     graph.find("person").connectBy("company")             // transforms existing graph
  //     graph.dup()
  //     graph.clone().find("person").connectBy("company")     // shared properties
  //     graph.deepClone().find("person").connectBy("company") // unique properties
  //
  //     graph.find("#one").compute("popularity", function(node) { return node.indegree() / node.outdegree(); })
  //
  //     {
  //       // What if the calculation relied on the graph / selection?
  //       // Graph can be accessed through the node. ?
  //       function popularity(node) {
  //         return node.indegree() / node.outdegree();
  //       }
  //
  //       // context-based
  //       Kraken.fn.popularity = function() {
  //         return this.compute("popularity", popularity);
  //       }
  //
  //       // injection approach
  //       Kraken.fn.popularity = function(selection) {
  //         selection.compute("popularity", popularity);
  //         return selection;
  //       }
  //     }
  //
  //     // get
  //     assert(graph.prop("#one") instanceof Node);
  //     assert(graph.prop("#one").degree())
  //   });
  // })
})
