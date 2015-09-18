var Kraken = require("../kraken");

var map = [].map;
var filter = [].filter;
var slice = [].slice;
var forEach = [].forEach;

var core = module.exports = {
  // Make sure the prototype behaves like an array
  length: 0,
  splice: Array.prototype.splice,
  forEach: Array.prototype.forEach,

  // TODO: jQuery tracks all operations via the stack, even if it results
  // in invalid selectors.  Should we be doing the same?
  pushStack: function(source, context) {
    var kraken = new Kraken(this.graph, source, context);
    kraken.prevObject = this;
    return kraken;
  },

  find: function(selector) {
    // var self = this;
    // var ret = Kraken.push(this, "", "find", selector), length = 0;
    //
    // this.forEach((component, index) {
    //   graph.find(selector, self[index], )
    // })
    // for ( var i = 0, l = this.length; i < l; i++ ) {
    //   length = ret.length;
    //   jQuery.find( selector, this[i], ret );
    //
    //   if ( i > 0 ) {
    //     // Make sure that the results are unique
    //     for ( var n = length; n < ret.length; n++ ) {
    //       for ( var r = 0; r < length; r++ ) {
    //         if ( ret[r] === ret[n] ) {
    //           ret.splice(n--, 1);
    //           break;
    //         }
    //       }
    //     }
    //   }
    // }
    //
    // return ret;
  },

  slice: function() {
    var components = slice.apply(this, arguments);
    // var b = slice.call(arguments).join(",");

    return this.pushStack(components);
    // return this.pushStack(a, "slice", b);
  },

  // forEach alias, feels more natural when you're also using eachNode /
  // eachEdge
  each: function(callback, context) {
    forEach.call(this, callback); // context?
    return this;
  },

  eachNode: function(callback, context) {
    forEach.call(this, function(component, index, array) {
      if (component.node) callback.call(context, component, index, array);
    });

    return this;
  },

  eachEdge: function(callback, context) {
    forEach.call(this, function(component, index, array) {
      if (component.edge) callback.call(context, component, index, array);
    });

    return this;
  },

  nodes: function() {
    return filter.call(this, function(component) {
      return component.node;
    });
  },

  edges: function() {
    return filter.call(this, function(component) {
      return component.edge;
    });
  },

  map: function(callback, context) {
    var result = map.call(this, callback, context);
    return this.pushStack(result);
  },

  filter: function(callback, context) {
    var result = filter.call(this, callback, context);
    return this.pushStack(result);
  },

  count: function() {
    return this.length;
  },

  at: function(index) {
    return index === -1 ? this.slice(index) : this.slice(index, +index + 1);
  },

  first: function() {
    return this.at(0);
  },

  last: function() {
    return this.at(-1);
  },

  top: function(count) {
    return this.slice(0, count ? count : 1);
  },

  bottom: function(n) {
    return this.slice(count ? -count : -1);
  },

  toArray: function() {
    // return this.slice(0);
    return slice.call(this, 0);
  }
}
