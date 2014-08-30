var assert = require("assert");
var EdgeIndex = require("../../src/index/edge_index");

suite("EdgeIndex", function() {
  function node(id) { return {id: id}; }
  function edge(id) { return {id: id}; }

  var one   = node("1"),
      two   = node("2"),
      three = node("3"),
      four  = node("4");

  var index = new EdgeIndex();
  index.add(one,  two,   edge("12a"));
  index.add(one,  two,   edge("12b"));
  index.add(one,  three, edge("13a"));
  index.add(two,  one,   edge("21a"));
  index.add(four, three, edge("43a"));

  test("#from(source)", function() {
    assert.equal(index.from(one).length, 3);
    assert.deepEqual(index.from(one).edges, [{id: "12a"}, {id: "12b"}, {id: "13a"}]);
  })

  test("#from(source, target)", function() {
    assert.equal(index.from(one, two).length, 2);
    assert.deepEqual(index.from(one, two).edges, [{id: "12a"}, {id: "12b"}]);
  })

  test("#to(target)", function() {
    assert.equal(index.to(three).length, 2);
    assert.deepEqual(index.to(three).edges, [{id: "13a"}, {id: "43a"}]);
  })
})
