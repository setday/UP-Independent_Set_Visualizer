import Graph from "./graphs/graph";
import GraphViewModel from "./graphs/graphViewModel";
import GraphScene from "./scene";
import GraphGUI from "./gui";
import str_graph from './graphs/graphExample';
import str_IS from './graphs/IndependentSetExample';

const scene = new GraphScene();

const graph = new Graph();
graph.loadGraph(str_graph);

const url_string = window.location.href;
const url = new URL(url_string);
let ur_IS_str = url.searchParams.get("IS");
if (ur_IS_str == null) ur_IS_str = str_IS;
else ur_IS_str = "[" + ur_IS_str + "]";

graph.loadIndependentSet(ur_IS_str);

const graphView = new GraphViewModel(graph, scene.scene);

const gui = new GraphGUI(graphView);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {

    scene.camera.aspect = window.innerWidth / window.innerHeight;
    scene.camera.updateProjectionMatrix();
    scene.renderer.setSize(window.innerWidth, window.innerHeight);
    animate();

}

function animate() {

    requestAnimationFrame( animate );

    scene.controls.update();

    scene.renderer.render( scene.scene, scene.camera );

    gui.stats.update();

}

if (scene != null) {

    animate();

}
