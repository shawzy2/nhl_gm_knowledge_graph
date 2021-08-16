import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import coseBilkent from 'cytoscape-cose-bilkent';


cytoscape.use( cola );
cytoscape.use( coseBilkent );

const layout = {
    animate: true,
    animationDuration: undefined,
    animationEasing: undefined,
    boundingBox: undefined,
    componentSpacing: 40,
    coolingFactor: 0.99,
    fit: true,
    gravity: 1,
    initialTemp: 1000,
    minTemp: 1.0,
    name: 'cola',
    nestingFactor: 1.2,
    nodeDimensionsIncludeLabels: false,
    nodeOverlap: 4,
    numIter: 1000,
    padding: 30,
    position(node) {
        return { row: node.data('row'), col: node.data('col') }
    },
    randomize: true,
    refresh: 20,
  };
// const style = {
//     width: '1600px',
//     height: '850px',
// }
const stylesheet = [
    {
      selector: 'node',
      style: {
        width: 20,
        height: 20,
        shape: 'circle',
        color: 'white',
        label: 'data(id)'
      }
    },
    {
      selector: 'edge',
      style: {
        width: 2,
        "curve-style": 'bezier'
      }
    }
  ]

export const Trades = ({ trades, layout, style }) => {

    return (
        <div>
            <CytoscapeComponent elements={trades} layout={layout} style={style} stylesheet={stylesheet}
                                    minZoom={.5} maxZoom={4}/>
        </div>
    )
}

// style={style}