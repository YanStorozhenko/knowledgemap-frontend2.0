import { useEffect, useState } from "react";

export default function ToursTable({ onEdit }) {
    const [tours, setTours] = useState([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_BASE_URL + "/tours", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setTours(data));
    }, []);

    return (
        <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-indigo-100">
            <tr>
                <th className="px-4 py-2 text-gray-800 text-left">ID</th>
                <th className="px-4 py-2 text-gray-800 text-left">Назва</th>
                <th className="px-4 py-2 text-gray-800 text-left">Дата</th>
                <th className="px-4 py-2 text-gray-800">Дія</th>
            </tr>
            </thead>
            <tbody>
            {tours.map(tour => (
                <tr key={tour.id} className="even:bg-white odd:bg-gray-50 hover:bg-indigo-50">
                    <td className="px-4 py-2 text-gray-800">{tour.id}</td>
                    <td className="px-4 py-2 text-gray-900">{tour.title}</td>
                    <td className="px-4 py-2 text-gray-700">{tour.date}</td>
                    <td className="px-4 py-2">
                        <button
                            className="text-indigo-600 hover:underline"
                            onClick={() => onEdit(tour)}
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
