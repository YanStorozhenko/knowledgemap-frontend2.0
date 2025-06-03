import { useEffect, useState } from "react";
import Graph from "../components/Graph/Graph";
import type { NodeData, EdgeData } from "../components/Graph/Graph";

import {
    mapContainer,
    header,
    title,
    subtitle,
    graphArea,
    loadingText,
} from "./MapStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MapPage() {
    const [nodes, setNodes] = useState<NodeData[]>([]);
    const [edges, setEdges] = useState<EdgeData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const [nodesRes, edgesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/nodes`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/node-connections`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const rawNodes = await nodesRes.json();
                const rawEdges = await edgesRes.json();

                const mappedEdges = rawEdges.map((edge: any) => ({
                    from: edge.from_node_id,
                    to: edge.to_node_id,
                    label: edge.type,
                }));

                const rankedNodes = assignLevels(rawNodes, mappedEdges);

                setNodes(rankedNodes);
                setEdges(mappedEdges);
            } catch (err) {
                console.error("Помилка при завантаженні графу:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={mapContainer}>
            <div className={header}>
                <h1 className={title}>Інтерактивна карта знань</h1>
                <p className={subtitle}>Натисніть на вузли для вивчення тем</p>
            </div>

            <div className={graphArea}>
                {loading ? (
                    <div className={loadingText}>Завантаження графу...</div>
                ) : (
                    <Graph nodes={nodes} edges={edges} />
                )}
            </div>
        </div>
    );
}

// 🔧 Допоміжна функція для обчислення рівнів вузлів
function assignLevels(
    nodes: NodeData[],
    edges: EdgeData[]
): (NodeData & { level: number })[] {
    const inDegree = new Map<number, number>();
    const graph = new Map<number, number[]>();

    nodes.forEach(node => {
        inDegree.set(node.id, 0);
        graph.set(node.id, []);
    });

    edges.forEach(edge => {
        graph.get(edge.from)?.push(edge.to);
        inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    });

    const queue: { id: number; level: number }[] = [];
    const levels = new Map<number, number>();

    inDegree.forEach((deg, id) => {
        if (deg === 0) {
            queue.push({ id, level: 0 });
            levels.set(id, 0);
        }
    });

    while (queue.length > 0) {
        const { id, level } = queue.shift()!;
        for (const neighbor of graph.get(id)!) {
            inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
            if (inDegree.get(neighbor) === 0) {
                const newLevel = level + 1;
                queue.push({ id: neighbor, level: newLevel });
                levels.set(neighbor, newLevel);
            }
        }
    }

    return nodes.map(node => ({
        ...node,
        level: levels.get(node.id) ?? 0,
    }));
}
