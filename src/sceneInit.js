import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

function init() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 50;
    camera.position.y = 50;
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    scene.background = new THREE.Color( 0x87ceeb );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 1 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( - 3, 10, - 10 );
    scene.add( dirLight );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    
    
    if ( !WebGL.isWebGLAvailable() ) {

        const warning = WebGL.getWebGLErrorMessage();
        document.getElementById( 'container' ).appendChild( warning );

        return null;
    
    }

    return {
        scene,
        camera,
        renderer,
        controls
    }
}

export default init;
