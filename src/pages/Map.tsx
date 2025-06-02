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

                const nodesData = await nodesRes.json();
                const edgesData = await edgesRes.json();

                setNodes(nodesData);
                setEdges(
                    edgesData.map((edge: any) => ({
                        from: edge.from_node_id,
                        to: edge.to_node_id,
                        label: edge.type,
                    }))
                );
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
