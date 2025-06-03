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
    /** Ця функція буде викликатися щоразу, коли користувач клікає на вузол графа */
    onNodeClick?: (nodeId: number) => void;
}

export default function Graph({ nodes, edges, onNodeClick }: GraphProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const networkRef = useRef<Network | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Підготувати дані для vis-network
        const data = {
            nodes: new DataSet(nodes),
            edges: new DataSet(edges),
        };

        const options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'UD',       // зверху вниз
                    sortMethod: 'directed',// сортування за напрямком
                    nodeSpacing: 150,
                    levelSeparation: 200,
                },
            },
            nodes: {
                shape: 'dot',
                size: 20,
                font: {
                    size: 14,
                    color: '#ffffff',
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

        // Якщо раніше вже був створений граф — видалимо його
        if (networkRef.current) {
            networkRef.current.destroy();
            networkRef.current = null;
        }

        // Створюємо новий Network
        networkRef.current = new Network(containerRef.current, data, options);

        // Якщо передано колбек onNodeClick — підписуємося на подію 'click'
        if (onNodeClick && networkRef.current) {
            networkRef.current.on('click', (params) => {
                if (params.nodes.length > 0) {
                    const clickedId = params.nodes[0] as number;
                    onNodeClick(clickedId);
                }
            });
        }

        // Експортуємо віконну функцію, щоб можна було фокусувати вузол зовні (наприклад із Sidebar)
        window.__focusGraphNode = (id: number) => {
            if (!networkRef.current) return;
            networkRef.current.selectNodes([id]);
            networkRef.current.focus(id, {
                scale: 1.8,
                animation: { duration: 500 },
            });
        };
    }, [nodes, edges, onNodeClick]);

    return <div ref={containerRef} style={{ height: '100vh', width: '100%' }} />;
}

// Додаємо оголошення у глобальний тип Window
declare global {
    interface Window {
        /** Викликає фокусування (select + focus) відповідного вузла у графі */
        __focusGraphNode?: (id: number) => void;
    }
}
