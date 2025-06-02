import { useEffect, useState } from "react";

export default function PostsTable({ onEdit }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_BASE_URL + "/posts", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setPosts(data));
    }, []);

    return (
        <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-indigo-100">
            <tr>
                <th className="px-4 py-2 text-gray-800 text-left">ID</th>
                <th className="px-4 py-2 text-gray-800 text-left">Назва</th>
                <th className="px-4 py-2 text-gray-800 text-left">Автор</th>
                <th className="px-4 py-2 text-gray-800 ">Дія</th>
            </tr>
            </thead>
            <tbody>
            {posts.map(post => (
                <tr key={post.id} className="even:bg-white odd:bg-gray-50 hover:bg-indigo-50">
                    <td className="px-4 py-2 text-gray-800">{post.id}</td>
                    <td className="px-4 py-2 text-gray-900">{post.title}</td>
                    <td className="px-4 py-2 text-gray-700">{post.authorName}</td>
                    <td className="px-4 py-2">
                        <button
                            className="text-indigo-600 hover:underline"
                            onClick={() => onEdit(post)}
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
