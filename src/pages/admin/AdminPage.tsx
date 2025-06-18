import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
    containerStyle,
    titleStyle,
    sectionTitleStyle,
    tableContainerStyle,
    tableStyle,
    buttonEditStyle,
    buttonDeleteStyle,
    inputStyle,
    selectStyle
} from "./adminPageStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UserType {
    id: number;
    email: string;
    name: string;
    role: string;
}

interface NodeType {
    id: number;
    title: string;
}

interface ConnectionType {
    fromNodeId: number;
    toNodeId: number;
    type: string;
}

export default function AdminPage() {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [connections, setConnections] = useState<ConnectionType[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    const filteredNodes = searchTerm
        ? nodes.filter((node) =>
            node.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    useEffect(() => {
        const fetchRoleAndData = async () => {
            const user = getAuth().currentUser;
            if (!user) return navigate("/");
            const role = localStorage.getItem("role");
            if (role !== "admin") return navigate("/");

            const token = localStorage.getItem("token");

            try {
                const [nodeRes, connRes, userRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/nodes`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/node-connections`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE_URL}/users`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (!nodeRes.ok || !connRes.ok || !userRes.ok) return;

                const [nodes, connections, users] = await Promise.all([
                    nodeRes.json(),
                    connRes.json(),
                    userRes.json(),
                ]);

                setNodes(nodes);
                setConnections(connections);
                setUsers(users);
            } catch (err) {
                console.error("❌ Fetch failed:", err);
            }
        };

        fetchRoleAndData();
    }, [navigate]);

    const handleRoleChange = async (userId: number, newRole: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role: newRole }),
        });
        if (res.ok) {
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
            );
        }
    };

    return (
        <div className={containerStyle}>
            <h1 className={titleStyle}>Адмін-панель</h1>

            <section>
                <h2 className={sectionTitleStyle}>Користувачі</h2>
                <div className={tableContainerStyle}>
                    <table className={tableStyle}>
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Ім’я</th>
                            <th>Роль</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.email}</td>
                                <td>{u.name}</td>
                                <td>
                                    <select
                                        className={selectStyle}
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className={sectionTitleStyle}>Пошук вузлів</h2>
                <input
                    type="text"
                    className={inputStyle}
                    placeholder="🔍 Введіть назву вузла"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredNodes.length > 0 ? (
                    <div className={tableContainerStyle}>
                        <table className={tableStyle}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Назва</th>
                                <th>Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredNodes.map((n) => (
                                <tr key={n.id}>
                                    <td>{n.id}</td>
                                    <td>{n.title}</td>
                                    <td>
                                        <button className={buttonEditStyle}>Редагувати</button>
                                        <button className={buttonDeleteStyle}>Видалити</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    searchTerm && <p>Нічого не знайдено</p>
                )}
            </section>

            <section>
                <h2 className={sectionTitleStyle}>Зв’язки</h2>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                        <tr>
                            <th>Від</th>
                            <th>До</th>
                            <th>Назва вузла</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {connections
                            .filter(
                                (c) =>
                                    filteredNodes.some((n) => n.id === c.fromNodeId) ||
                                    filteredNodes.some((n) => n.id === c.toNodeId)
                            )
                            .map((c) => {
                                const fromNode = nodes.find((n) => n.id === c.fromNodeId);
                                const toNode = nodes.find((n) => n.id === c.toNodeId);
                                return (
                                    <tr key={`${c.fromNodeId}-${c.toNodeId}`}>
                                        <td>{c.fromNodeId} — {fromNode?.title || '—'}</td>
                                        <td>{c.toNodeId}</td>
                                        <td>{toNode?.title || '—'}</td>
                                        <td>
                                            <button className="btn btn-sm btn-info mr-2">Редагувати</button>
                                            <button className="btn btn-sm btn-error">Видалити</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>


        </div>
    );
}
