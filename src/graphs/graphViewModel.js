import * as THREE from 'three';

class GraphViewModel {
    constructor(graph, scene) {
        this.scene = scene;
        this.graph = graph;

        this.wrong_vertexes = true;

        this.edges = [];
        this.vertexes = [];
        this.layers = [
            [], // independent set
            [], // dist = 1
            [], // dist = 2
            [], // dist > 2 (lost)
        ];

        this.layers_show = [true, true, true, true];
        this.layer_edges_show = false;
        this.between_layer_edges_show = false;

        this.update_graph();
    }

    update_graph() {
        this.update_vertexes();
        this.edges = [];
    }

    update_vertexes() {
        for (let i = this.vertexes.length; i < this.graph.vertexCount; i++) {
            this.vertexes.push(new VertexViewModel(i, 0, 0, 0, -1, this.scene));
        }

        this.update_state();
    }

    update_edges() {
        this.edges = [];
        this.graph.edges.forEach((edge) => {
            const [source, target] = edge;
            if (source == target) {
                this.edges.push(new LoopViewModel(this.vertexes[source], this.scene));
            } else {
                this.edges.push(new EdgeViewModel(this.vertexes[source], this.vertexes[target], this.scene));
            }
        });
    }

    update_state() {
        this.layers = [[], [], [], []];

        this.vertexes.forEach(vertex => {
            vertex.layer = -1;
            vertex.corrupted = true;
        });

        if (this.graph.independentSet.length == 0) {
            this.vertexes.forEach(vertex => {
                vertex.layer = 1;
                vertex.corrupted = false;
                this.layers[1].push(vertex.id);
            });

            this.compute_layers_positions();
            
            return;
        }

        this.graph.independentSet.forEach(ISID => {
            const vertex = this.vertexes[ISID];
            if (vertex == undefined || vertex.layer == 0) return;
            vertex.layer = 0;
            vertex.corrupted = false;
            this.layers[0].push(vertex.id);
        });

        this.graph.edges.forEach(edge => {
            const [source, target] = edge;

            if (source == target) return;

            const sourceVertex = this.vertexes[source];
            const targetVertex = this.vertexes[target];

            if (sourceVertex.layer == 0 && targetVertex.layer == 0) {
                sourceVertex.corrupted = true;
                targetVertex.corrupted = true;

                return;
            }
            
            if (sourceVertex.layer == 0 && targetVertex.layer == -1) {
                targetVertex.layer = 1;
                targetVertex.corrupted = false;
                this.layers[1].push(target);

                return;
            }
            if (targetVertex.layer == 0 && sourceVertex.layer == -1) {
                sourceVertex.layer = 1;
                sourceVertex.corrupted = false;
                this.layers[1].push(source);
            }
        });

        this.graph.edges.forEach(edge => {
            const [source, target] = edge;

            if (source == target) return;
            
            const sourceVertex = this.vertexes[source];
            const targetVertex = this.vertexes[target];

            if (sourceVertex.layer == 1 && targetVertex.layer == -1) {
                targetVertex.layer = 2;
                targetVertex.corrupted = false;
                this.layers[2].push(target);

                return;
            }
            if (targetVertex.layer == 1 && sourceVertex.layer == -1) {
                sourceVertex.layer = 2;
                sourceVertex.corrupted = false;
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

        this.color_vertexes();
    }

    color_vertexes() {
        this.vertexes.forEach(vertex => {
            if (vertex.corrupted && this.wrong_vertexes) {
                vertex.change_color(0xff0000);
                return;
            }

            switch (vertex.layer) {
                case 0:
                    vertex.change_color(0xffffff);
                    break;
                case 1:
                    vertex.change_color(0xaaaaaa);
                    break;
                case 2:
                    vertex.change_color(0x444444);
                    break;
                case 3:
                    vertex.change_color(0x000000);
                    break;
            }
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

    enable_layer(layer, show) {
        this.layers_show[layer] = show;

        this.layers[layer].forEach(vertexID => {
            this.vertexes[vertexID].set_visible(show);
        });

        this.edges.forEach(edge => {
            const source = edge.source;
            const target = edge.target;
            if (source.layer == layer &&
                target.layer == layer) {
                edge.set_visible(show && this.layer_edges_show);
            } else if ((source.layer == layer ||
                        target.layer == layer)) {
                edge.set_visible(show && this.between_layer_edges_show);
            }
        });
    }

    show_wrong_vertexes(show) {
        this.wrong_vertexes = show;
        this.color_vertexes();
    }

    show_layer_edges(show) {
        if (show && this.edges.length == 0) this.update_edges();

        this.layer_edges_show = show;

        this.edges.forEach(edge => {
            const source_layer = edge.source.layer;
            const target_layer = edge.target.layer;
            if (source_layer == target_layer &&
                this.layers_show[source_layer]) {
                edge.set_visible(show);
            }
        });
    }

    show_between_layer_edges(show) {
        if (show && this.edges.length == 0) this.update_edges();

        this.between_layer_edges_show = show;

        this.edges.forEach(edge => {
            const source_layer = edge.source.layer;
            const target_layer = edge.target.layer;
            if (source_layer != target_layer &&
                this.layers_show[source_layer] &&
                this.layers_show[target_layer]) {
                edge.set_visible(show);
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

    set_visible(visible) {
        this.mesh.visible = visible;
    }
}

class EdgeViewModel {
    constructor(source, target, scene) {
        this.source = source;
        this.target = target;

        const points = [
            new THREE.Vector3(
                this.source.mesh.position.x,
                this.source.mesh.position.y,
                this.source.mesh.position.z
            ),
            new THREE.Vector3(
                this.target.mesh.position.x,
                this.target.mesh.position.y,
                this.target.mesh.position.z
            ),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial({ color: 0x000000 });

        this.mesh = new THREE.Line(geometry, material);

        scene.add(this.mesh);

        this.set_visible(false);
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
    
    set_visible(visible) {
        this.mesh.visible = visible;
    }

    destroy() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}

class LoopViewModel {
    constructor(source, scene) {
        this.source = source;
        this.target = source;

        const geometry = new THREE.TorusGeometry( 0.7, 0.03, 3, 5 );
        const material = new THREE.MeshPhongMaterial({ color: 0x000000 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI / 2;

        scene.add(this.mesh);

        this.set_visible(false);

        this.update();
    }

    update() {
        this.mesh.position.x = this.source.mesh.position.x;
        this.mesh.position.y = this.source.mesh.position.y + 1;
        this.mesh.position.z = this.source.mesh.position.z;
    }

    set_visible(visible) {
        this.mesh.visible = visible;
    }

    destroy() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}

export default GraphViewModel;
