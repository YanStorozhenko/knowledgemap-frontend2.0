import { useEffect, useRef } from 'react';
import { Network, DataSet } from 'vis-network/standalone';



 console.log(localStorage.getItem("lastFocusedNodeId"));

export interface NodeData {
    id: number;
    label: string;
    title: string;
    topicId: number;
    x: number | null;
    y: number | null;
    level: number;
    progress: number;
    status: 'completed' | 'available' | 'locked';
}


export interface EdgeData {
    from: number;
    to: number;
}

interface GraphProps {
    nodes: NodeData[];
    edges: EdgeData[];
    onNodeClick?: (nodeId: number) => void;
    activeNodeId?: number | null;
}

export default function Graph({ nodes, edges, onNodeClick }: GraphProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const networkRef = useRef<Network | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 💡 Мапимо кольори на основі progressStatus
        const coloredNodes = nodes.map((node) => {
            let color = '#888888'; // default (locked)

            if (node.status === 'completed') color = '#3B82F6'; // blue
            else if (node.status === 'available') color = '#10B981'; // green

            return {
                ...node,
                color: { background: color },
            };

        });

        const data = {
            nodes: new DataSet(coloredNodes),
            edges: new DataSet(edges),
        };


        // const nodeSpacingRand =  12 + (Math.random() * 8 - 4);
        // const levelSeparationRand =  70 + (Math.random() * 40 - 20);


        const options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'LR',
                    sortMethod: 'directed',
                    nodeSpacing: 40,
                    levelSeparation: 150,
                },
            },
            nodes: {
                shape: 'dot',
                size: 20,
                font: {
                    size: 14,
                    color: '#00ffff',
                },
            },
            edges: {
                arrows: {
                    to: { enabled: true, scaleFactor: 0.7 },
                },
                font: {
                    color: '#ffffff',
                    size: 12,
                    align: 'middle',
                },
            },
            physics: {
                enabled: false,
            },
            interaction: {
                hover: true,
            },
        };

        if (networkRef.current) {
            networkRef.current.destroy();
            networkRef.current = null;
        }

        networkRef.current = new Network(containerRef.current, data, options);

        if (onNodeClick && networkRef.current) {
            networkRef.current.on('click', (params) => {
                if (params.nodes.length > 0) {
                    const clickedId = params.nodes[0] as number;
                    onNodeClick(clickedId);
                    localStorage.setItem("lastFocusedNodeId", clickedId.toString());
                    console.log( nodes[clickedId].status);
                }

            });
        }

        window.__focusGraphNode = (id: number) => {
            if (!networkRef.current) return;
            networkRef.current.selectNodes([id]);
            networkRef.current.focus(id, {
                scale: 1,
                animation: {
                    duration: 500,
                    easingFunction: "easeInOutQuad",
                },
            });
        };
    }, [nodes, edges]);

    return <div ref={containerRef} style={{ height: '100vh', width: '100%' }} />;
}

declare global {
    interface Window {
        __focusGraphNode?: (id: number) => void;
    }
}
