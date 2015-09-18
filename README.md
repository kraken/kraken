kraken
======

The hackable, in-memory graph database built for the web. Runs in node and
all modern browsers.

Developed at [Kumu](https://kumu.io)

---

Getting technical, `kraken` is a directed multigraph with property support.
It can handle any type of graph thrown at it with the exception of graphs-that-aren't-really-graphs (we're talking about you hypergraphs),
which we have no plans to support.

If you're just getting started with graphs,
[Wikipedia's Graph Theory Glossasy](http://en.wikipedia.org/wiki/Glossary_of_graph_theory)
is a great place to start.

## Inspiration

The fluent, implicitly-iterative api was inspired by jquery and d3.
The graph selectors are obviously inspired by CSS.

https://github.com/jquery/jquery
https://github.com/mbostock/d3

Kraken was inspired by many existing graph databases:
- [snap](https://github.com/snap-stanford/snap)
- [networkx](http://networkx.github.io/)
- [neo4j](http://www.neo4j.org/)
- [graphx](http://spark.apache.org/docs/1.0.0/graphx-programming-guide.html)
- [giraph](http://giraph.apache.org/)
- [sigmajs](https://github.com/jacomyal/sigma.js/)
- [igraph](https://github.com/igraph/igraph)
- [gremlin](https://github.com/tinkerpop/gremlin)
- [cayley](https://github.com/google/cayley)
- [graphd](http://dl.acm.org/citation.cfm?id=1807283)
- [mapgraph](http://mapgraph.io/)
- [cytoscape](http://cytoscape.github.io/cytoscape.js/index.html)

## Architecture

All nodes and edges belong to a single graph but properties are shared.
IDs are explicit and must be unique across the entire graph (node and edge cannot share same id).

Are metrics stored on the graph or the components? Since metrics are usually
unique to the graph it makes more sense to store them on the graph and allow them
to be saved as properties.  But is that worth the extra complexity?

All properties are indexed by b-tree.

Selectors and selector results are cached.
Multiple strategies?
- Least recently used (LRU)
- Least frequently used (LFU)
- Shortest lookup time (SLT)

Graph and selections behave very similar but there are some differences.

Shared API:

Graph:
- add()
- connect()
- size()
- order()

Selection API:
(Subset of the graph api?)

TODO:
- [ ] can we just store properties directly on the entity? use symbols / getters
      for the core properties? if we can't do that I think we either stick
      with the backbone get/set or jquery's attr approach

## License

Was hoping to release this under MIT but pretty sure a couple of the dependencies
use Apache 2.0 (mathjs does for sure, pretty sure pourover and crossfilter do too).

math.js is overkill for our needs though.  All we need is basic arithmetic with
and a few common functions (like min, max, abs, exp, log, etc).

Might want to look into
- https://github.com/ripplejs/expression
- https://github.com/soney/jsep
- https://github.com/gamtiq/eva
- https://github.com/l8nite/matheval
