import ELK from 'elkjs/lib/elk.bundled.js';
import React, { useCallback, useEffect, useState, useLayoutEffect, useMemo } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Panel,
    useNodesState,
    useEdgesState,
    useReactFlow,
    MiniMap,
    Background,
    Controls,
    useStore,
    MarkerType,
    useOnSelectionChange,
    useOnViewportChange,
} from 'reactflow';
import CustomNode from './SwitchNode';
import DownloadButton from './DownloadPNG';
import FloatingEdge from './FloatingEdge';
import FloatingConnectionLine from './FloatingConnectionLine';
import 'reactflow/dist/style.css';
import './style.css'
import '../GlassyPage/style.css'
const edgeTypes = {
    smart: FloatingEdge,
}
const nodeTypes = {
    Node: CustomNode,
    
};
const connectionLineStyle = { stroke: '#0000ff' }; 

const elkOptions = {
    'elk.algorithm': 'mrtree', 
    'elk.alignment': 'DOWN',
    'elk.direction': 'DOWN',
    'elk.spacing.nodeNode': '500',
     'elk.spacing.edgeNode': '500',
};

const elk = new ELK();

function Layered() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [apiData, setApiData] = useState(null);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [selectedEdges, setSelectedEdges] = useState([]);
    const onConnect = useCallback(params => {
        setEdges(eds => addEdge({ ...params, type: 'smart', markerEnd: { type: MarkerType.Arrow } }, eds));
    }, [setEdges]);
    
    useLayoutEffect(() => {
        fetch('http://localhost:4000/isis_data')
            .then(response => response.json())
            .then(data => {
                setApiData(data); // Set fetched data into state
            })
            .catch(error => console.error('Failed to fetch data:', error));
    }, []);
    const computedNodesAndEdges = useMemo(() => {
        if (!apiData) return { nodes: [], edges: [] };
    
        const nodesMap = new Map();
        const edges = [];
    
        apiData.data.forEach(item => {
            if (!nodesMap.has(item.lspId)) {
                nodesMap.set(item.lspId, {
                    id: item.lspId,
                    type: 'Node',
                    data: {
                        label: item.lspId,
                        details: {
                            lspId: item.lspId,
                            neighbors: item.neighbors.map(neighbor => neighbor.neighborId)
                        }
                    },
                    position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
                });
            }
    
            item.neighbors.forEach(neighbor => {
                if (!nodesMap.has(neighbor.neighborId)) {
                    nodesMap.set(neighbor.neighborId, {
                        id: neighbor.neighborId,
                        type: 'Node',
                        data: {
                            label: neighbor.neighborId,
                            details: {  
                                lspId: neighbor.neighborId,
                                metric: neighbor.metric 
                            }
                        },
                        position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
                    });
                }
    
                edges.push({
                    id: `edge-${item.lspId}-${neighbor.neighborId}`,
                    source: item.lspId,
                    target: neighbor.neighborId,
                    type: 'smart',
                    data: {
                        label: `${item.lspId} -> ${neighbor.neighborId} (Metric: ${neighbor.metric})`
                    },
                   
                    style: { strokeWidth: 10 }
                });
            });
        });
    
        return { nodes: Array.from(nodesMap.values()), edges };
    }, [apiData]); 
    
      useEffect(() => {
        if (!apiData) return;
        
        const { nodes, edges } = computedNodesAndEdges;
        
        elk.layout({
          id: "root",
          children: nodes.map(node => ({ id: node.id, width: 100, height: 200 })),
          edges: edges.map(edge => ({ id: edge.id, sources: [edge.source], targets: [edge.target] })),
          layoutOptions: elkOptions,
        }).then(layout => {
          const layoutedNodes = layout.children.map(node => ({
            ...nodes.find(n => n.id === node.id),
            position: { x: node.x, y: node.y },
          }));
      
          const layoutedEdges = layout.edges.map(edge => ({
            ...edges.find(e => e.id === edge.id),
          }));
      
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
        });
      }, [computedNodesAndEdges]);
      
    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
          setSelectedNodes(nodes.map((node) => node.id));
          setSelectedEdges(edges.map((edge) => edge.id));
        },
      });

    
    const onEdgeClick = useCallback((evt, id) => {
        console.log('onEdgeClick', id);
    }, []);
    
    //   useOnViewportChange({
    //     onStart: (Viewport) => console.log('start', Viewport),
    //     onChange: ( Viewport) => console.log('change', Viewport),
    //     onEnd: (Viewport) => console.log('end', Viewport),
    //   });
      console.log(nodes, edges);
    return (
        <div className='reactflow-graph'>
            <ReactFlow
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                onEdgeClick={onEdgeClick}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                connectionLineStyle={connectionLineStyle}
                minZoom={-Infinity}
                maxZoom={Infinity}
                className="floatingedges"
                fitView
                panOnScroll={true}
                panOnDrag={true}
                connectionLineComponent={FloatingConnectionLine}
            >
                <Controls  style={{display:'none'}}/>
                <MiniMap />
                <DownloadButton  />
              
            </ReactFlow>
        </div>
    );
}
export default () => (
    <ReactFlowProvider>
        <Layered />
    </ReactFlowProvider>
);
