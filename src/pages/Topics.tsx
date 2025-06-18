import { useEffect, useState } from "react";

interface Topic {
    id: number;
    title: string;
}

const containerStyle = "min-h-screen bg-base-200 p-6 flex flex-col items-center";
const titleStyle = "text-3xl md:text-5xl font-bold text-primary mb-6 text-center";
const searchInputStyle = "input input-bordered w-full max-w-lg mb-8";
const cloudStyle = "w-full max-w-6xl flex flex-wrap justify-center gap-4 text-center";
const tagStyle = "text-base md:text-lg lg:text-xl bg-primary text-primary-content px-4 py-2 rounded-full shadow hover:scale-105 transition-transform cursor-default max-w-xs truncate animate-fade-in";
const loadingStyle = "min-h-screen flex items-center justify-center bg-base-200 p-6 text-xl text-base-content";

// локальна анімація
const style = `
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
`;

export default function Topics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/topics`)
            .then((res) => res.json())
            .then((data) => {
                setTopics(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredTopics = topics.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div className={loadingStyle}>Завантаження тем...</div>;
    }

    return (
        <div className={containerStyle}>
            <style>{style}</style>
            <h1 className={titleStyle}>Теми, які ти зможеш вивчити</h1>

            <input
                type="text"
                placeholder="Пошук теми..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={searchInputStyle}
            />

            <div className={cloudStyle}>
                {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic, index) => (
                        <span
                            key={topic.id}
                            className={tagStyle}
                            title={topic.title}
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            {topic.title}
                        </span>
                    ))
                ) : (
                    <div className="text-base-content">Нічого не знайдено</div>
                )}
            </div>
        </div>
    );
}
