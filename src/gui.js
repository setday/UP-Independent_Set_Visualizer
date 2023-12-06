import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module'
import str_graph from './graphs/graphExample';

class GraphGUI {

    constructor(graphView) {

        this.panel = new GUI( { width: 300 } );

        const folder1 = this.panel.addFolder( 'Vizualization' );
    
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
        subfolder1.close();
    
        folder1.close();
    
        const folder2 = this.panel.addFolder( 'Loaders' );
    
        folder2.add( {'Graph': str_graph.substring( 1, str_graph.length - 1 )}, "Graph" ).onFinishChange( function (value) {
            graphView.graph.loadGraph( '[' + value + ']' );
            graphView.update_graph();
        } );
        folder2.add( {'Independent set': graphView.graph.independentSet.toString()}, "Independent set" ).onFinishChange( function (value) {
            graphView.graph.loadIndependentSet( '[' + value + ']' );
            graphView.update_state();
        } );
    
        folder2.open();
    
        const folder3 = this.panel.addFolder( 'Algorithm' );
    
        folder3.add( {'Find independent set': function() {
            const independentSet = graphView.graph.findIndependentSet();
            console.log(independentSet);
        }}, "Find independent set");
    
        folder3.close();
    
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    
    }

}

export default GraphGUI;
