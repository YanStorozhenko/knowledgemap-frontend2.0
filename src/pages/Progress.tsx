import { useEffect, useState } from "react";
import type { NodeData } from "../components/Graph/Graph";
import {
    containerStyle,
    titleStyle,
    statBoxStyle,
    statLabelStyle,
    statValueStyle,
    nodeListStyle,
    nodeItemStyle,
} from "./ProgressPageStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProgressPage() {
    const [nodes, setNodes] = useState<NodeData[]>([]);
    const [, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/nodes/graph`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                const formattedNodes = data.nodes.map((node: any) => ({
                    ...node,
                    label: node.title || `Вузол ${node.id}`,
                }));
                setNodes(formattedNodes);
            } catch (err) {
                console.error("Помилка при завантаженні прогресу:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const completedCount = nodes.filter(n => n.status === "completed").length;
    const availableCount = nodes.filter(n => n.status === "available").length;

    return (
        <div className={containerStyle}>
            <h1 className={titleStyle}>Твій прогрес</h1>

            <div className={statBoxStyle}>
                <div className={statLabelStyle}>Завершено / Доступно</div>
                <div className={statValueStyle}>{completedCount} / {availableCount}</div>
            </div>

            <ul className={nodeListStyle}>
                {nodes.map((node) => (
                    <li
                        key={node.id}
                        className={`${nodeItemStyle} ${
                            node.status === "completed"
                                ? "text-blue-400"
                                : node.status === "available"
                                    ? "text-primary"
                                    : "text-neutral"
                        }`}
                    >
                        {node.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
