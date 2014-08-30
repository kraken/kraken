// var Set = require("set");

// Inspired by sizzle:
// https://github.com/jquery/sizzle/wiki/Sizzle-Documentation
// https://github.com/samleb/bouncer
//
// TODO:
// - lfu selector cache (or heaviest)

// var Kraken = require("./kraken");
var selectors = {match: {}, find: {}, filter: {}, pseudo: {}};

var proto = module.exports = {
  find: function(selector, context) {
    // return Kraken
    // if (selector === "*") {
    //   return this.slice(0);
    // } else {
    //   return
    // }
  },

  closest: function(selector) {
    // var set = new Set();
    // var result = Kraken.push(this, selector);
    //
    // this.each(function(component, index) {
    //   set.add(closest);
    // });
    //
    // return result;
  },

  filter: function(selector) {

  },

  // Public: Tests if the component matches the selector.
  //
  // Examples
  //   test("[label]", node)
  //
  // Returns true if component matches the selector.
  test: function(selector) {

  },

  compile: function(selector) {

  }
};
