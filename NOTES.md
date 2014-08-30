**Shortest path problems**
http://en.wikipedia.org/wiki/Shortest_path_problem

Still haven't settled on which algorithm is the best one for us.
If positions were available then A* would probably be the best call but I'm
not sure we have a decent heuristic we can use without them.

- Dijkstra's algorithm solves the single-source shortest path problem.
- Bellman–Ford algorithm solves the single-source problem if edge weights may be negative.
- A* search algorithm solves for single pair shortest path using heuristics to try to speed up the search.
- Floyd–Warshall algorithm solves all pairs shortest paths.
- Johnson's algorithm solves all pairs shortest paths, and may be faster than Floyd–Warshall on sparse graphs.
- Viterbi algorithm solves the shortest stochastic path problem with an additional probabilistic weight on each node.

Should we nest all path calculations under a separate path controller under graph.paths()?

var components = graph.components()

components.forEach(function(graph) {
  graph.calc("betwenness")
})

var paths = graph.paths()
paths.shortest(source)
paths.shortest(source, target)
paths.exists?(source, target)
paths.distance(source, target)
paths.get(source)
paths.get(source, target)
paths.from(source)

Kraken.fn.
Kraken.selection.fn
Kraken.match.fn

Kraken.graph.fn... = {}

Kraken.path.fn.shortest = function(source, target) {

}

graph.find("person").paths().shortest(target)

vs

graph.shortestPath(source, target)
graph.pathExists?(source, target)
graph.getPath(source, target)
graph.getPathsFrom(source)

**Core architecture**
https://www.npmjs.org/package/cheerio

**Selector parsing**

registerOperator
registerSelector

https://www.npmjs.org/package/cheerio-select
https://www.npmjs.org/package/CSSselect
https://github.com/ded/qwery
https://github.com/dperini/nwmatcher/
https://github.com/FB55/CSSwhat

**Metric normalization**
Look into Freeman's general formula for centralization.

**Pipes / middleware**

Do we want to tackle the idea of dynamic graphs and pipes? Should we generalize
the indexing process to build on top of this?

It's important to remember that it can be very inefficient to calculate some
values incrementally (such as betweenness).

The GraphStream project is built on a similar foundation:
http://graphstream-project.org/doc/Tutorials/Getting-Started_1.0/

```
graph = Kraken.graph()
  .use(XYZMetric)
  .use(XYZTransform)
  .add(...)
  .connect(...)
```

Cayley's morphisms look like an interesting way to build reusable
traversals and transforms (https://github.com/google/cayley)

```
var costars = Kraken.op().in("starring").out("starring")
var costars = Kraken.op().find("> film > actor")
graph.find("#kevin-bacon").find(costars).collect("name")
graph.find("#kevin-bacon").apply(costars)
```
