import * as THREE from 'three';

class GraphViewModel {
    constructor(graph, scene) {
        this.scene = scene;
        this.graph = graph;

        this.edges = [];
        this.vertexes = [];
        this.layers = [
            [], // independent set
            [], // dist = 1
            [], // dist = 2
            [], // dist > 2 (lost)
        ];

        this.update_graph();
    }

    update_graph() {
        this.update_vertexes();
    }

    update_vertexes() {
        for (let i = this.vertexes.length; i < this.graph.vertexCount; i++) {
            this.vertexes.push(new VertexViewModel(i, 0, 0, 0, -1, this.scene));
        }

        this.update_state();
    }

    update_edges() {
        this.edges = [];
        for (let i = 0; i < this.graph.edges.length; i++) {
            const [source, target] = this.graph.edges[i];
            if (source == target) {
                this.edges.push(new LoopViewModel(this.vertexes[source], this.scene));
            } else {
                this.edges.push(new EdgeViewModel(this.vertexes[source], this.vertexes[target], this.scene));
            }
        }
    }

    update_state() {
        this.layers = [[], [], [], []];

        this.vertexes.forEach(vertex => {
            vertex.layer = -1;
            vertex.change_color(0xff0000);
            vertex.corrupted = true;
        });

        if (this.graph.independentSet.length == 0) {
            this.vertexes.forEach(vertex => {
                vertex.layer = 1;
                vertex.corrupted = false;
                vertex.change_color(0xffffff);
                this.layers[1].push(vertex.id);
            });

            this.compute_layers_positions();
            
            return;
        }

        this.graph.independentSet.forEach(ISID => {
            const vertex = this.vertexes[ISID];
            vertex.layer = 0;
            vertex.corrupted = false;
            vertex.change_color(0xffffff);
            this.layers[0].push(vertex.id);
        });

        this.graph.edges.forEach(edge => {
            const [source, target] = edge;

            if (source == target) return;

            const sourceVertex = this.vertexes[source];
            const targetVertex = this.vertexes[target];

            if (sourceVertex.layer == 0 && targetVertex.layer == 0) {
                sourceVertex.corrupted = true;
                sourceVertex.change_color(0xff0000);
                targetVertex.corrupted = true;
                targetVertex.change_color(0xff0000);

                return;
            }
            
            if (sourceVertex.layer == 0 && targetVertex.layer == -1) {
                targetVertex.layer = 1;
                targetVertex.corrupted = false;
                targetVertex.change_color(0xaaaaaa);
                this.layers[1].push(target);

                return;
            }
            if (targetVertex.layer == 0 && sourceVertex.layer == -1) {
                sourceVertex.layer = 1;
                sourceVertex.corrupted = false;
                sourceVertex.change_color(0xaaaaaa);
                this.layers[1].push(source);
            }
        });

        this.graph.edges.forEach(edge => {
            const [source, target] = edge;
            const sourceVertex = this.vertexes[source];
            const targetVertex = this.vertexes[target];

            if (sourceVertex.layer == 1 && targetVertex.layer == -1) {
                targetVertex.layer = 2;
                targetVertex.corrupted = false;
                targetVertex.change_color(0x444444);
                this.layers[2].push(target);

                return;
            }
            if (targetVertex.layer == 1 && sourceVertex.layer == -1) {
                sourceVertex.layer = 2;
                sourceVertex.corrupted = false;
                sourceVertex.change_color(0x444444);
                this.layers[2].push(source);
            }
        });

        this.vertexes.forEach(vertex => {
            if (vertex.layer == -1) {
                vertex.layer = 3;
                this.layers[3].push(vertex.id);
            }
        });

        this.compute_layers_positions();

        this.edges.forEach(edge => {
            edge.update();
        });
    }

    compute_layers_positions() {
        this.layers.forEach((layer, i) => {
            this.compute_layer_positions(i);
        });
    }

    compute_layer_positions(i) {
        const numberSquare = Math.ceil(Math.sqrt(this.layers[i].length));
        const dSize = 3;

        const x = -(numberSquare - 1) / 2 * dSize;
        const y = -(i - 1) * dSize * 3;
        const z = -(numberSquare - 1) / 2 * dSize;

        let dx = 0;
        let dz = 0;

        this.layers[i].forEach(vertexID => {
            const vertex = this.vertexes[vertexID];
            vertex.translate(x + dx * dSize, y, z + dz * dSize);

            dx++;
            if (dx >= numberSquare) {
                dx = 0;
                dz++;
            }
        });
    }
}

class VertexViewModel {
    constructor(id, x, y, z, layer, scene) {
        this.id = id;

        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        
        this.mesh = new THREE.Mesh(geometry, material);

        scene.add(this.mesh);

        this.corrupted = false;
    }

    translate(x, y, z) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }

    change_color(color) {
        this.mesh.material.color.setHex(color);
    }

    hide() {
        this.mesh.visible = false;
    }

    show() {
        this.mesh.visible = true;
    }
}

class EdgeViewModel {
    constructor(source, target, scene) {
        this.source = source;
        this.target = target;

        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2.0 });

        this.mesh = new THREE.Line(geometry, material);

        scene.add(this.mesh);
    }

    update() {
        this.mesh.geometry.attributes.position.array[0] = this.source.mesh.position.x;
        this.mesh.geometry.attributes.position.array[1] = this.source.mesh.position.y;
        this.mesh.geometry.attributes.position.array[2] = this.source.mesh.position.z;

        this.mesh.geometry.attributes.position.array[3] = this.target.mesh.position.x;
        this.mesh.geometry.attributes.position.array[4] = this.target.mesh.position.y;
        this.mesh.geometry.attributes.position.array[5] = this.target.mesh.position.z;

        this.mesh.geometry.attributes.position.needsUpdate = true;
    }

    hide() {
        this.mesh.visible = false;
    }

    show() {
        this.mesh.visible = true;
    }
}

class LoopViewModel {
    constructor(source, scene) {
        this.source = source;

        const geometry = new THREE.TorusGeometry( 0.7, 0.03, 3, 5 );
        const material = new THREE.MeshPhongMaterial({ color: 0x000000 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI / 2;

        scene.add(this.mesh);
    }

    update() {
        this.mesh.position.x = this.source.mesh.position.x;
        this.mesh.position.y = this.source.mesh.position.y + 1;
        this.mesh.position.z = this.source.mesh.position.z;
    }

    hide() {
        this.mesh.visible = false;
    }

    show() {
        this.mesh.visible = true;
    }
}

export default GraphViewModel;
