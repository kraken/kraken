var assert = require("assert");
var is = require("is");
var nextID = require("../../src/utils").id;

suite("utils.id", function() {
  test("generates numeric ids", function() {
    assert(is.number(nextID()));
  });

  test("generates a new id each call", function() {
    assert(nextID() != nextID());
  })
})
