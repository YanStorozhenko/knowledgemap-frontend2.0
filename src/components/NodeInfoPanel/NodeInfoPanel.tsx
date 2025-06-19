import { useEffect, useState } from "react";
import type { NodeData } from "../Graph/Graph";

interface Topic {
    id: number;
    title: string;
    description: string;
}

interface NodeInfoPanelProps {
    node: NodeData | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const cardStyle = "card w-72 max-h-[400px] overflow-y-auto bg-base-100 shadow-md m-4";

const bodyStyle = "card-body min-h-48 p-4";
const titleStyle = "text-xl font-bold";
const descriptionStyle = "text-sm whitespace-pre-wrap";
const placeholderStyle = "italic text-sm";


interface NodeInfoPanelProps {
    node: NodeData | null;
    onProgressUpdate?: () => void;
}

export default function NodeInfoPanel({ node, onProgressUpdate }: NodeInfoPanelProps){
    const [topic, setTopic] = useState<Topic | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        // Витягти користувача з localStorage
        const stored = localStorage.getItem("firebaseUser");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);


                setCurrentUserId(parsed.uid);
            } catch {
                setCurrentUserId(null);
            }
        }
    }, []);

    useEffect(() => {
        if (!node) {
            setTopic(null);
            return;
        }

        fetch(`${API_BASE_URL}/topics/${node.id}`)
            .then((res) => res.json())
            .then((data) => {
                setTopic(data);
            })
            // .then(setTopic)
            .catch(() => setTopic(null));
    }, [node?.id]);


    const handleMarkAsLearned = async () => {


        const token = localStorage.getItem("token");
        if (!node || !token || !currentUserId) {
            console.warn("❌ Не вистачає даних:", { node, token, currentUserId });
            return;
        }

        const payload = {
            userUid: currentUserId, // firebase UID
            topicId: node.id,
                status: "completed",
        };


        const res = await fetch(`${API_BASE_URL}/progress`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            // const text = await res.text();
            // console.error(`❌ Сервер повернув ${res.status}:`, text);
            return;
        }

        // const data = await res.json();
        // console.log("✅ Відповідь сервера:", data);

        await onProgressUpdate?.();
    };



    return (
        <div className={cardStyle}>
            <div className={bodyStyle}>
                {!node ? (
                    <p className={placeholderStyle}>Оберіть вузол, щоб побачити інформацію</p>
                ) : (
                    <>
                        {node.status === 'available' && (
                            <button
                                onClick={handleMarkAsLearned}
                                className="btn btn-success mb-4 w-full"
                            >
                                ✅ Вивчити
                            </button>
                        )}

                        {node.status === 'completed' && (
                            <button
                                disabled
                                className="btn btn-primary mb-4 w-full"
                            >
                                ✔ Вивчено
                            </button>
                        )}

                        {node.status === 'locked' && (
                            <button
                                disabled
                                className="btn btn-outline mb-4 w-full"
                            >
                                🔒 Недоступно
                            </button>
                        )}


                        <h2 className={titleStyle}>{node.label}</h2>

                        {topic?.description && (
                            <p className={descriptionStyle}>{topic.description}</p>
                        )}

                    </>
                )}
            </div>
        </div>
    );
}
