import { useEffect, useState } from "react";
import UserRow from "../UserRow/UserRow";
import { useNavigate } from "react-router-dom";





export default function UsersTable() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState("id");
    const [sortAsc, setSortAsc] = useState(true);

    const navigate = useNavigate();


    useEffect(() => {
        fetch(import.meta.env.VITE_API_BASE_URL + "/users/getAll", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => {
                if (res.status === 401 || res.status === 404) {
                    navigate('/404');
                    return null; // зупинити .then(data => ...)
                }
                return res.json();
            })
            .then(data => {
                if (data) setUsers(data);
            })
            .catch(err => console.error("Помилка завантаження користувачів:", err));
    }, []);


    const filteredUsers = users
        .filter(user =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const getValue = (item) => {
                if (sortKey === "role") return item.role?.name?.toLowerCase() || "";
                return item[sortKey]?.toString().toLowerCase();
            };

            const aVal = getValue(a);
            const bVal = getValue(b);

            if (aVal < bVal) return sortAsc ? -1 : 1;
            if (aVal > bVal) return sortAsc ? 1 : -1;
            return 0;
        });

    const handleSort = (key) => {
        if (key === sortKey) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(true);
        }
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between mb-2">
                <input
                    type="text"
                    placeholder="Пошук по імені або email"
                    className="border px-3 py-2 rounded w-full max-w-sm text-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className="min-w-full bg-white shadow rounded">
                <thead>
                <tr className="bg-indigo-100 text-left">
                    <th className="px-4 py-2 text-gray-800 cursor-pointer" onClick={() => handleSort("id")}>ID</th>
                    <th className="px-4 py-2 text-gray-800 cursor-pointer" onClick={() => handleSort("name")}>Ім’я</th>
                    <th className="px-4 py-2 text-gray-800 cursor-pointer" onClick={() => handleSort("email")}>Email</th>
                    <th className="px-4 py-2 text-gray-800 cursor-pointer" onClick={() => handleSort("role")}>Роль</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <UserRow key={user.id} user={user} />
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center py-4 text-gray-500">Немає користувачів</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
