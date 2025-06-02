import { useEffect, useState } from "react";
import UsersTable from "../../components/admin/UsersTable/UsersTable";

export default function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_BASE_URL + "/users/getAll", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Помилка завантаження користувачів:", err));
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Користувачі (адмінка)</h1>
            <UsersTable users={users} />
        </div>
    );
}
