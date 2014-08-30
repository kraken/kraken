// parse?
var format = {
  accept: function(data) {
    return data && (data.nodes || data.edges);
  },

  load: function(graph, data) {
    data.nodes.forEach(function(def) {
      graph.add(def);
    });

    data.edges.forEach(function(def) {
      graph.connect(def[0], def[1], def[2]);
    });
  },

  dump: function(graph) {
    return {nodes: [], edges: []};
  }
};

module.exports = format;
