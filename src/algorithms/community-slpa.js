//
// Follows the standard speak/listen algorithm described in
// http://arxiv.org/pdf/1109.5720v3.pdf but uses suggest / select
// terminology instead.
//
// This algorithm returns a map of <node id, <community, probability>>
//   eg. {"node1" => {"community1" => 0.1, "community2" => 0.5}}
//
//
// Resources
//
// http://arxiv.org/pdf/1109.5720v3.pdf
// http://www.cs.rpi.edu/~xiej2/Publication/SLPA_PAKDD.pdf (p3)
// http://toreopsahl.com/datasets/ (p10 for high school network)
// http://onlinelibrary.wiley.com/doi/10.1002/wics.1319/epdf
//
// TODO: remove nested communities

var shuffle = require("array-shuffle");

// T: number of iterations
// r: between 0 and 0.5 (disjoint communities above 0.5)
function slpa(graph, options) {
  // Default number of iterations
  var T = (options && options.t) || 100;

  // Default community probability threshold
  var r = (options && options.r) || 0.05;

  var memories = {};

  // Initialize communities
  //
  // TODO: array-shuffle strictly checks for arrays so we need to convert
  // the collection to an array first. Let's find a shuffle function that
  // works with collections.
  var nodes = graph.nodes().toArray();

  // Remove disconnected nodes since they have no one to suggest / select with
  nodes = nodes.filter(function(node) {
    return node.getEdgeCount() > 0;
  });

  nodes.forEach(function(node, i) {
    var community = node.prop("community") || (i + 1); // uuid()
    var memory = memories[node.id] = createMemoryStore();
    addCommunity(memory, community);
  });

  // Each neighbor of the selected node randomly selects a label with
  // probability proportional to the occurrence frequency of this label
  // in its memory and sends the selected label to the listener.
  //
  // (This is the "speaking rule" in the classic sense)
  function suggestCommunity(node) {
    var community;
    var memory = memories[node.id];

    // TODO: Not sure how to efficiently sample our structure with
    // "probability proportional to frequency" but I think this works. Pretty
    // sure this unfairly favors the earlier communities in the list and
    // possibly the last one which has a 100% of being selected if it is
    // ever reached.
    for (community in memory.communities) {
      var count = memory.communities[community];
      var frequency = count / memory.size;
      if (Math.random() <= frequency) break;
    }

    return community;
  }

  // Out of all the suggested communities, each node needs to pick just one
  // to join. We pick the most popular one.
  //
  // (This is the "listening rule" in the classic sense)
  function selectCommunity(memory) {
    return memory.best.community;
  }

  // Propagate
  //
  // Each neighbor suggests a community for the listener to join,
  // and the listener joins a single community from the suggestions.
  //
  // TODO: use Map and shared memory instance instead that can be cleared
  // to be GC friendly
  for (var t = 1; t < T; t++) { // step 0 was the initialization
    nodes = shuffle(nodes);
    nodes.forEach(function(node) {
      // prevent undefined communities from being added to memory
      if (node.getInEdgeCount() === 0) return;

      var memory = createMemoryStore();

      node.inEdges().forEach(function(edge) {
        addCommunity(memory, suggestCommunity(edge.source()));
      });

      addNodeToCommunity(node, selectCommunity(memory));
    });

    graph.emit("progress", t / T, "slpa");
  }

  // Apply threshold to remove communities with probability < r
  var result = {};
  nodes.forEach(function(node) {
    var memory = memories[node.id];
    var communities = result[node.id] = {};

    // TODO: not sure if our probability calculation is right here
    for (var community in memory.communities) {
      var count = memory.communities[community];
      var probability = count / memory.size;
      if (probability >= r) communities[community] = probability;
    }
  });

  // TODO: remove nested communities

  graph.emit("progress", 1, "slpa");

  return result;

  // This method bumps the count for the given community while
  // incrementally tracking the total memory size, total number of unique
  // communities, and the most popular community seen so far.
  function addCommunity(memory, community) {
    var count = memory.communities[community] || 0;

    // Increment the count for this community
    memory.communities[community] = ++count;

    // Increment the agregate number of community references (non-unique)
    memory.size++;

    // If this is a new community, increment the community count
    if (count === 1) memory.communityCount++;

    // TODO: To make this fair we might want to randomly decide who
    // wins in the case of a tie. The shuffling for each round may
    // already be taking care of that for us though.
    if (count > memory.best.count) {
      memory.best.community = community;
      memory.best.count = count;
    }
  }

  function addNodeToCommunity(node, community) {
    addCommunity(memories[node.id], community);
  }

  function createMemoryStore() {
    return {
      communities: {},          // map of community names to counts
      communityCount: 0,        // total number of communities (unique)
      size: 0,                  // total number of community references (non-unique)
      best: {                   // tracks the most popular community seen so far
        community: undefined,
        count: 0
      }
    };
  }
}

module.exports = slpa;
