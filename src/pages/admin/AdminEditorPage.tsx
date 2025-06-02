import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UsersTable from "../../components/admin/UsersTable/UsersTable";
import PostsTable from "../../components/admin/PostsTable/PostsTable";
import LocationsTable from "../../components/admin/LocationsTable/LocationsTable";
import ToursTable from "../../components/admin/ToursTable/ToursTable";

export default function AdminEditorPage() {
    const [activeTab, setActiveTab] = useState("users");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const navigate = useNavigate();









    const tabs = [
        { key: "users", label: "Користувачі" },
        { key: "posts", label: "Пости" },
        { key: "locations", label: "Локації" },
        { key: "tours", label: "Тури" },
    ];

    const openAddForm = () => {
        setFormData({
            title: "",
            content: "",
            image_url: "",
            tags: [],
            name: "",
            country: "",
            description: "",
            date: new Date().toISOString().split("T")[0],
        });
        setIsEditing(false);
        setShowForm(true);
    };

    const openEditForm = (item) => {
        setFormData(item);
        setEditingId(item.id);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getUrl = () => {
        const base = import.meta.env.VITE_API_BASE_URL;
        if (activeTab === "posts") return `${base}/posts`;
        if (activeTab === "locations") return `${base}/locations`;
        if (activeTab === "tours") return `${base}/tours`;
        return "";
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing ? `${getUrl()}/${editingId}` : getUrl();

        const payload = (() => {
            switch (activeTab) {
                case "posts":
                    return {
                        title: formData.title,
                        content: formData.content,
                        image_url: formData.image_url,
                        tags: [],
                    };
                case "locations":
                    return {
                        name: formData.name,
                        country: formData.country,
                        image_url: formData.image_url,
                        description: formData.description,
                    };
                case "tours":
                    return {
                        title: formData.title,
                        date: formData.date,
                        image_url: formData.image_url,
                        description: formData.description,
                    };
                default:
                    return {};
            }
        })();

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });



            if (res.ok) {
                setRefreshTrigger(prev => prev + 1);
                setShowForm(false);
            } else {

                if (res.status === 401 || res.status === 404) {
                    navigate('/404');
                }

                console.error(await res.text());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        const url = `${getUrl()}/${editingId}`;
        try {
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                setRefreshTrigger(prev => prev + 1);
                setShowForm(false);
            } else {
                console.error(await res.text());
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Редагування контенту (адмінпанель)</h1>

            <div className="flex gap-2 mb-4 flex-wrap">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded font-medium transition shadow-sm
                            ${activeTab === tab.key
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                    >
                        {tab.label}
                    </button>
                ))}
                {activeTab !== "users" && (
                    <button
                        onClick={openAddForm}
                        className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                    >
                        ➕ Додати новий
                    </button>
                )}
            </div>

            {activeTab === "users" && <UsersTable key={refreshTrigger} />}
            {activeTab === "posts" && <PostsTable key={refreshTrigger} onEdit={openEditForm} />}
            {activeTab === "locations" && <LocationsTable key={refreshTrigger} onEdit={openEditForm} />}
            {activeTab === "tours" && <ToursTable key={refreshTrigger} onEdit={openEditForm} />}

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg space-y-4 text-gray-900">
                        <h2 className="text-xl font-semibold mb-2">{isEditing ? "Редагувати" : "Додати"} {tabs.find(t => t.key === activeTab)?.label}</h2>

                        {activeTab === "posts" && (
                            <>
                                <input name="title" placeholder="Заголовок" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                                <textarea name="content" placeholder="Опис" value={formData.content} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                                <input name="image_url" placeholder="URL зображення" value={formData.image_url} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                            </>
                        )}

                        {activeTab === "locations" && (
                            <>
                                <input name="name" placeholder="Назва" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                                <input name="country" placeholder="Країна" value={formData.country} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                                <input name="image_url" placeholder="URL зображення" value={formData.image_url} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                                <textarea name="description" placeholder="Опис" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                            </>
                        )}

                        {activeTab === "tours" && (
                            <>
                                <input name="title" placeholder="Назва туру" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                                <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                                <input name="image_url" placeholder="URL зображення" value={formData.image_url} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                                <textarea name="description" placeholder="Опис" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded text-gray-900" />
                            </>
                        )}

                        <div className="flex justify-between items-center pt-2">
                            <div className="flex gap-2">
                                <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded">Скасувати</button>
                                <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">Зберегти</button>
                            </div>
                            {isEditing && (
                                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">🗑️ Видалити</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
