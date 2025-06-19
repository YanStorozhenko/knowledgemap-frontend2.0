import { useEffect, useState } from "react";
import Graph from "../components/Graph/Graph";
import SidebarNodes from "../components/SidebarNodes/SidebarNodes";
import type { NodeData, EdgeData } from "../components/Graph/Graph";
import NodeInfoPanel from "../components/NodeInfoPanel/NodeInfoPanel";

import {
    header,
    title,
    subtitle,
    graphArea,
    loadingText,
} from "./MapStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MapPage() {
    const [nodes, setNodes] = useState<(NodeData & { level: number })[]>([]);
    const [edges, setEdges] = useState<EdgeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
    const [refresh, setRefresh] = useState(0);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(`${API_BASE_URL}/nodes/graph`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();

                if (localStorage.getItem("lastFocusedNodeId")) {
                    setTimeout(() => {
                        window.__focusGraphNode?.(Number(localStorage.getItem("lastFocusedNodeId")));
                    }, 300);
                }

                const formattedNodes = data.nodes.map((node: any) => ({
                    ...node,
                    label: node.title || `Вузол ${node.id}`,
                }));

                setNodes(formattedNodes);

                const formattedEdges = data.edges.map(({ from, to }: EdgeData) => ({ from, to }));
                setEdges(formattedEdges);

                setLoading(false);
            } catch (err) {
                console.error("Помилка при завантаженні графу:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refresh]);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar з динамічною шириною */}
            <div className={`transition-all duration-300 ${showSidebar ? "w-64" : "w-0"} flex-shrink-0 overflow-hidden`}>
                <SidebarNodes
                    nodes={nodes}
                    activeNodeId={activeNodeId}
                    onSidebarNodeClick={(id) => {
                        setActiveNodeId(id);
                        window.__focusGraphNode?.(id);
                    }}
                />
            </div>

            <div className="flex-1 flex flex-col">
                <div className={header}>
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <h1 className={title}>Інтерактивна карта знань</h1>
                            <p className={subtitle}>Натисніть на вузли для вивчення тем</p>
                        </div>
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={() => setShowSidebar(prev => !prev)}
                        >
                            {showSidebar ? "← Приховати панель" : "→ Показати панель"}
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className={graphArea}>
                        {loading ? (
                            <div className={loadingText}>Завантаження графу...</div>
                        ) : (
                            <Graph
                                nodes={nodes}
                                edges={edges}
                                onNodeClick={(id) => setActiveNodeId(id)}
                                activeNodeId={activeNodeId}
                            />
                        )}
                    </div>

                    <NodeInfoPanel
                        key={activeNodeId + '-' + refresh}
                        node={nodes.find(n => n.id === activeNodeId) || null}
                        onProgressUpdate={() => setRefresh(r => r + 1)}
                    />
                </div>
            </div>
        </div>
    );
}
