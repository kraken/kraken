var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("betweenness", function() {
    // Kraken.add(range(0, 5))
    var graph = Kraken()
      .add(0)
      .add(1)
      .add(2)
      .add(3)
      .add(4)
      .add(5)
      .connect(1, 2)
      .connect(1, 5)
      .connect(2, 3)
      .connect(2, 5)
      .connect(3, 4)
      .connect(5, 4)
      .connect(5, 1, "51a")
      .connect(5, 1, "51b");

    // NOTE: No idea if these values are correct yet
    var result = graph.collect("betweenness", true);
    assert.equal(result[0], 0);
    assert.equal(result[1], 0.1);
    assert.equal(result[2], 0.1);
    assert.equal(result[3], 0.025);
    assert.equal(result[4], 0);
    assert.equal(result[5], 0.125);
  })
})
