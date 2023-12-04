class Graph {
    constructor() {
        this.vertexCount = 0;
        this.edges = [];
        this.independentSet = [];
    }

    clear() {
        this.vertexCount = 0;
        this.edges = [];
        this.independentSet = [];
    }

    loadGraph(edgesString) {
        this.clear();

        const edges = JSON.parse(edgesString);
        edges.forEach(edge => {
            this.addEdge(edge);
        });
    }

    addEdge(edge) {
        const [source, target] = edge;
        this.edges.push([source, target]);
        this.vertexCount = Math.max(this.vertexCount, source + 1, target + 1);
    }

    loadIndependentSet(setsString) {
        this.independentSet = JSON.parse(setsString);
    }
}

module.exports = Graph;
