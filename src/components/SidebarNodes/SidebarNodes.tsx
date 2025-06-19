import { useEffect, useState } from "react";
import type { NodeData } from "../Graph/Graph";

interface SidebarNodesProps {
    nodes: (NodeData & { level: number })[];
    onSidebarNodeClick?: (nodeId: number) => void;
    activeNodeId?: number | null;
}

export default function SidebarNodes({
                                         nodes,
                                         onSidebarNodeClick,
                                         activeNodeId = null,
                                     }: SidebarNodesProps) {
    const [focusedId, setFocusedId] = useState<number | null>(activeNodeId);
    const [expandedLevels, setExpandedLevels] = useState<number[]>([]);
    const [panelExpanded, setPanelExpanded] = useState(true);

    useEffect(() => {
        setFocusedId(activeNodeId ?? null);
    }, [activeNodeId]);

    const validNodes = nodes.filter((n) => typeof n.level === "number");

    const grouped = validNodes.reduce((acc, node) => {
        if (!acc[node.level]) acc[node.level] = [];
        acc[node.level].push(node);
        return acc;
    }, {} as Record<number, Array<NodeData & { level: number }>>);

    const sortedLevels = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b);

    if (!panelExpanded) {
        return (
            <div className="p-4">
                <button
                    className="btn btn-sm"
                    onClick={() => setPanelExpanded(true)}
                >
                    ▶ Показати рівні
                </button>
            </div>
        );
    }

    const toggleLevel = (level: number) => {
        setExpandedLevels((prev) =>
            prev.includes(level)
                ? prev.filter((l) => l !== level)
                : [...prev, level]
        );
    };

    return (
        <aside className="w-64 bg-base-200 p-4 border-r border-base-content/10 rounded shadow">
            {/*<button*/}
            {/*    className="btn btn-sm mb-4"*/}
            {/*    onClick={() => setPanelExpanded(false)}*/}
            {/*>*/}
            {/*    ✖ Приховати рівні*/}
            {/*</button>*/}

            <h2 className="text-xl font-bold mb-4">Навчальні рівні</h2>
            {sortedLevels.map((level) => {
                const isExpanded = expandedLevels.includes(level);
                return (
                    <div key={level} className="mb-2">
                        <div
                            className="text-lg font-semibold mb-1 cursor-pointer hover:underline"
                            onClick={() => toggleLevel(level)}
                        >
                            {isExpanded ? "▾" : "▸"} Рівень {level}
                        </div>

                        {isExpanded && (
                            <ul className="ml-4 list-inside text-sm space-y-1">
                                {grouped[level].map((node) => {
                                    const isActive = node.id === focusedId;
                                    let colorClass = "text-base-content";
                                    if (node.status === "completed") colorClass = "text-info";
                                    else if (node.status === "available") colorClass = "text-success";
                                    else if (node.status === "locked") colorClass = "text-neutral";

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
                        )}
                    </div>
                );
            })}
        </aside>
    );
}
