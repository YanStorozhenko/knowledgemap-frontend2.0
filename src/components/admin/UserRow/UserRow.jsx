import { useState } from "react";

export default function UserRow({ user }) {
    const [currentRole, setCurrentRole] = useState(user.role);
    const [loading, setLoading] = useState(false);

    const handleRoleChange = async (e) => {
        const newRole = e.target.value;
        setLoading(true);

        try {
            const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/users/${user.id}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();
            if (res.ok) {
                setCurrentRole(newRole);
            } else {
                console.error("❌ Помилка оновлення ролі:", data.error || res.statusText);
            }
        } catch (error) {
            console.error("❌ Помилка мережі при оновленні ролі:", error);
        }

        setLoading(false);
    };

    return (
        <tr className="even:bg-white odd:bg-gray-50 hover:bg-indigo-50 transition-colors">
            <td className="px-4 py-3 text-sm text-gray-800">{user.id}</td>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
            <td className="px-4 py-3 text-sm">
                <select
                    className="border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-indigo-400"
                    value={currentRole}
                    onChange={handleRoleChange}
                    disabled={loading}
                >
                    <option value="admin">admin</option>
                    <option value="moderator">moderator</option>
                    <option value="user">user</option>
                </select>
            </td>
        </tr>
    );
}
