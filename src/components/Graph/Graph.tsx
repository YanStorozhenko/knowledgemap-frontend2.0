import { useEffect, useRef } from 'react';
import { Network, DataSet } from 'vis-network/standalone';

export interface NodeData {
    id: number;
    label: string;
    color?: string;
}

export interface EdgeData {
    from: number;
    to: number;
    label?: string;
}

interface GraphProps {
    nodes: NodeData[];
    edges: EdgeData[];
}

export default function Graph({ nodes, edges }: GraphProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const data = {
            nodes: new DataSet(nodes),
            edges: new DataSet(edges),
        };

        const options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'UD', // напрямок: зверху вниз
                    sortMethod: 'directed', // сортування за напрямком ребер
                    nodeSpacing: 150,
                    levelSeparation: 200,
                },
            },
            physics: {
                enabled: false, // вимкнення фізичної симуляції
            },
            interaction: {
                hover: true,
            },
        };

        new Network(containerRef.current, data, options);
    }, [nodes, edges]);

    return <div ref={containerRef} style={{ height: '100vh', width: '100%' }} />;
}
