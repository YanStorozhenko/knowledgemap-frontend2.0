import { useEffect, useState } from "react";

interface Topic {
    id: number;
    title: string;
}

const containerStyle = "min-h-screen bg-base-200 p-6 flex flex-col items-center";
const titleStyle = "text-3xl md:text-5xl font-bold text-primary mb-8 text-center";
const cloudStyle = "w-full max-w-6xl flex flex-wrap justify-center gap-4 text-center";
const tagStyle = "text-base md:text-lg lg:text-xl bg-primary text-primary-content px-4 py-2 rounded-full shadow hover:scale-105 transition-transform cursor-default max-w-xs truncate";
const loadingStyle = "min-h-screen flex items-center justify-center bg-base-200 p-6 text-xl text-base-content";

export default function Topics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/topics`)
            .then((res) => res.json())
            .then((data) => {
                setTopics(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className={loadingStyle}>Завантаження тем...</div>;
    }

    return (
        <div className={containerStyle}>
            <h1 className={titleStyle}>Теми, які ти зможеш вивчити</h1>
            <div className={cloudStyle}>
                {topics.map((topic) => (
                    <span key={topic.id} className={tagStyle}>
                        {topic.title}
                    </span>
                ))}
            </div>
        </div>
    );
}
