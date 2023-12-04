import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import Graph from "./graphs/graph";
import GraphViewModel from "./graphs/graphViewModel";
import init from "./sceneInit";
import str_graph from './graphs/graphExample';
import str_IS from './graphs/IndependentSetExample';

const scene = init();

const graph = new Graph();
graph.loadGraph(str_graph);
graph.loadIndependentSet(str_IS);

const panel = new GUI( { width: 310 } );

const folder1 = panel.addFolder( 'Vizualization' );
const folder2 = panel.addFolder( 'Loaders' );
const folder3 = panel.addFolder( 'Algorithm' );

// panelSettings = {
//     'modify time scale': 1.0
// };

// const baseNames = [ 'None', ...Object.keys( baseActions ) ];

// for ( let i = 0, l = baseNames.length; i !== l; ++ i ) {

//     const name = baseNames[ i ];
//     const settings = baseActions[ name ];
//     panelSettings[ name ] = function () {

//         const currentSettings = baseActions[ currentBaseAction ];
//         const currentAction = currentSettings ? currentSettings.action : null;
//         const action = settings ? settings.action : null;

//         if ( currentAction !== action ) {

//             prepareCrossFade( currentAction, action, 0.35 );

//         }

//     };

//     crossFadeControls.push( folder1.add( panelSettings, name ) );

// }

// for ( const name of Object.keys( additiveActions ) ) {

//     const settings = additiveActions[ name ];

//     panelSettings[ name ] = settings.weight;
//     folder2.add( panelSettings, name, 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

//         setWeight( settings.action, weight );
//         settings.weight = weight;

//     } );

// }

// folder3.add( panelSettings, 'modify time scale', 0.0, 1.5, 0.01 ).onChange( modifyTimeScale );

folder1.open();
folder2.open();
folder3.open();

const graphView = new GraphViewModel(graph, scene.scene);

function animate() {

    requestAnimationFrame( animate );

    scene.controls.update();

    scene.renderer.render( scene.scene, scene.camera );

}

if (scene != null) {

    animate();

}
