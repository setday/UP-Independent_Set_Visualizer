import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module'

import Graph from "./graphs/graph";
import GraphViewModel from "./graphs/graphViewModel";
import init from "./sceneInit";
import str_graph from './graphs/graphExample';
import str_IS from './graphs/IndependentSetExample';

const scene = init();

const graph = new Graph();
graph.loadGraph(str_graph);
graph.loadIndependentSet(str_IS);

const graphView = new GraphViewModel(graph, scene.scene);

const panel = new GUI( { width: 310 } );

const folder1 = panel.addFolder( 'Vizualization' );

folder1.add( {'Show between layer edges': false}, "Show between layer edges" ).listen().onChange( function (value) {
    graphView.show_between_layer_edges(value);
} );
folder1.add( {'Show layer edges': false}, "Show layer edges" ).listen().onChange( function (value) {
    graphView.show_layer_edges(value);
} );
folder1.add( {'Show wrong vertexes': true}, "Show wrong vertexes" ).listen().onChange( function (value) {
    graphView.show_wrong_vertexes(value);
} );

const subfolder1 = folder1.addFolder( 'Layers' );
subfolder1.add( {'Layer 0 (Independent set)': true}, "Layer 0 (Independent set)" ).listen().onChange( function (value) {
    graphView.enable_layer(0, value);
} );
subfolder1.add( {'Layer 1 (Dist = 1)': true}, "Layer 1 (Dist = 1)" ).listen().onChange( function (value) {
    graphView.enable_layer(1, value);
} );
subfolder1.add( {'Layer 2 (Dist = 2)': true}, "Layer 2 (Dist = 2)" ).listen().onChange( function (value) {
    graphView.enable_layer(2, value);
} );
subfolder1.add( {'Layer 3 (Lost | Dist > 2)': true}, "Layer 3 (Lost | Dist > 2)" ).listen().onChange( function (value) {
    graphView.enable_layer(3, value);
} );

folder1.open();

const folder2 = panel.addFolder( 'Loaders' );

folder2.add( {'Graph': str_graph.substring(1, str_graph.length - 1)}, "Graph" ).onFinishChange( function (value) {
    graph.loadGraph( '[' + value + ']' );
    graphView.update_graph();
} );
folder2.add( {'Independent set': str_IS.substring(1, str_IS.length - 1)}, "Independent set" ).onFinishChange( function (value) {
    graph.loadIndependentSet( '[' + value + ']' );
    graphView.update_state();
} );

folder2.open();

const folder3 = panel.addFolder( 'Algorithm' );

const bt = folder3.add( {'Find independent set': function() {
    const independentSet = graph.findIndependentSet();
    console.log(independentSet);

    alert("It is your homework to implement this functionality!");
}}, "Find independent set");

const stats = new Stats();
document.body.appendChild(stats.dom);

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

    stats.update();

}

if (scene != null) {

    animate();

}
