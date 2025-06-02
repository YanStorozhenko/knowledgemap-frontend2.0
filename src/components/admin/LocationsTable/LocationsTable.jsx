import { useEffect, useState } from "react";

export default function LocationsTable({ onEdit }) {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_BASE_URL + "/locations", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setLocations(data));
    }, []);

    return (
        <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-indigo-100">
            <tr>
                <th className="px-4 py-2 text-gray-800 text-left">ID</th>
                <th className="px-4 py-2 text-gray-800 text-left">Назва</th>
                <th className="px-4 py-2 text-gray-800 text-left">Країна</th>
                <th className="px-4 py-2 text-gray-800 ">Дія</th>
            </tr>
            </thead>
            <tbody>
            {locations.map(loc => (
                <tr key={loc.id} className="even:bg-white odd:bg-gray-50 hover:bg-indigo-50">
                    <td className="px-4 py-2 text-gray-800">{loc.id}</td>
                    <td className="px-4 py-2 text-gray-900">{loc.name}</td>
                    <td className="px-4 py-2 text-gray-700">{loc.country}</td>
                    <td className="px-4 py-2">
                        <button
                            className="text-indigo-600 hover:underline"
                            onClick={() => onEdit(loc)}
                        >
                            Редагувати
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
