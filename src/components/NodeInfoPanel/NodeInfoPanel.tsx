import type { NodeData } from "../Graph/Graph";

// 🔹 Стилі
const cardWrapper = "card w-72 bg-base-100 shadow-md m-4";
const cardBody = "card-body p-4";
const headingStyle = "text-xl font-bold";
const labelStyle = "font-semibold";
const placeholderStyle = "italic text-sm";

interface NodeInfoPanelProps {
    node: NodeData | null;
}

export default function NodeInfoPanel({ node }: NodeInfoPanelProps) {
    return (
        <div className={cardWrapper}>
            <div className={cardBody}>
                {!node ? (
                    <p className={placeholderStyle}>
                        Оберіть вузол, щоб побачити інформацію
                    </p>
                ) : (
                    <>
                        <h2 className={headingStyle}>Інформація про вузол</h2>
                        <p><span className={labelStyle}>ID:</span> {node.id}</p>
                        <p><span className={labelStyle}>Назва:</span> {node.label}</p>
                        {node.color && (
                            <p><span className={labelStyle}>Колір:</span> {node.color}</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
