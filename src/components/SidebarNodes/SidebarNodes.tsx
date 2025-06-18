import { useEffect, useState } from "react";
import type { NodeData } from "../Graph/Graph";

interface SidebarNodesProps {
    /** Масив вузлів з інформацією про level */
    nodes: (NodeData & { level: number })[];
    /** Функція-виклик, коли користувач клікає на пункт у списку */
    onSidebarNodeClick?: (nodeId: number) => void;
    /** Якщо в графі було натиснуто вузол — це id передається сюди, щоб підсвітити у списку */
    activeNodeId?: number | null;
}

export default function SidebarNodes({
                                         nodes,
                                         onSidebarNodeClick,
                                         activeNodeId = null,
                                     }: SidebarNodesProps) {
    const [focusedId, setFocusedId] = useState<number | null>(activeNodeId);

    useEffect(() => {
        setFocusedId(activeNodeId ?? null);
    }, [activeNodeId]);

    // Фільтруємо тільки вузли з числовим level
    const validNodes = nodes.filter((n) => typeof n.level === "number");

    // Групуємо вузли за level
    const grouped = validNodes.reduce((acc, node) => {
        if (!acc[node.level]) acc[node.level] = [];
        acc[node.level].push(node);
        return acc;
    }, {} as Record<number, Array<NodeData & { level: number }>>);

    const sortedLevels = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <aside className="w-64 bg-base-200 p-4 overflow-y-auto border-r border-base-content/10">
            <h2 className="text-xl font-bold mb-4">Навчальні рівні</h2>
            {sortedLevels.map((level) => (
                <div key={level} className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Рівень {level}</h3>
                    <ul className="ml-4 list-inside text-sm space-y-1">
                        {grouped[level].map((node) => {
                            const isActive = node.id === focusedId;

                            let colorClass = "text-base-content";
                            if (node.status === "completed") colorClass = "text-blue-400";
                            else if (node.status === "available") colorClass = "text-green-500";
                            else if (node.status === "locked") colorClass = "text-gray-400";

                            const finalClass = `cursor-pointer ${colorClass} ${
                                isActive ? "font-bold underline" : ""
                            }`;

                            return (
                                <li
                                    key={node.id}
                                    className={finalClass}
                                    onClick={() => {
                                        setFocusedId(node.id);
                                        onSidebarNodeClick?.(node.id);
                                        localStorage.setItem("lastFocusedNodeId", node.id.toString());
                                    }}
                                >
                                    {node.title}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </aside>
    );
}
