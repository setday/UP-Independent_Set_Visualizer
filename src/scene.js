import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

class GraphScene {

    constructor() {

        if ( !WebGL.isWebGLAvailable() ) {
    
            const warning = WebGL.getWebGLErrorMessage();
            document.getElementById( 'container' ).appendChild( warning );
    
            return;
        
        }

        this.scene = new THREE.Scene();
    
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 50;
        this.camera.position.y = 50;
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
        
        this.scene.background = new THREE.Color( 0x87ceeb );
    
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 1 );
        hemiLight.position.set( 0, 20, 0 );
        this.scene.add( hemiLight );
    
        const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
        dirLight.position.set( - 3, 10, - 10 );
        this.scene.add( dirLight );
    
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set( 0, 0, 0 );

    }

}

export default GraphScene;
