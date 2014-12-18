// Graph from http://reference.wolfram.com/language/ref/EigenvectorCentrality.html
var assert = require("assert");
var Kraken = require("../kraken");

suite("metrics", function() {
  test("eigenvector", function() {
    var graph = Kraken()
      .undirected()
      .add("Nora")
      .add("Rose")
      .add("Larry")
      .add("Linda")
      .add("Ben")
      .add("Anna")
      .add("James")
      .add("Rudy")
      .add("Carol")
      .connect("Anna", "Carol")
      .connect("Anna", "Ben")
      .connect("Anna", "Rose")
      .connect("Anna", "Nora")
      .connect("Anna", "Larry")
      .connect("Anna", "Rudy")
      .connect("Carol", "Ben")
      .connect("Ben", "Rose")
      .connect("Rose", "Nora")
      .connect("Nora", "Larry")
      .connect("Larry", "Linda")
      .connect("Linda", "James")
      .connect("James", "Rudy");

    var result = graph.collect("eigenvector", true);
    assert.equal(round(result["Anna"]),   0.210286);
    assert.equal(round(result["Rose"]),   0.143608);
    assert.equal(round(result["Nora"]),   0.139443);
    assert.equal(round(result["Ben"]),    0.135122);
    assert.equal(round(result["Larry"]),  0.116895);
    assert.equal(round(result["Carol"]),  0.102306);
    assert.equal(round(result["Rudy"]),   0.072595);
    assert.equal(round(result["Linda"]),  0.044934);
    assert.equal(round(result["James"]),  0.034811);

    function round(value) { return value.toFixed(6); }
  })
})
