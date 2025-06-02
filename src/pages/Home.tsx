import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl md:text-6xl font-bold text-center text-primary mb-4">
                Інтерактивна карта знань
            </h1>
            <p className="text-lg md:text-xl text-center text-base-content mb-6 max-w-2xl">
                Вивчай основи програмування за допомогою візуальної мапи, що веде тебе
                від простих понять до складних тем.
            </p>
            <Link to="/graph" className="btn btn-primary text-lg">
                Почати навчання
            </Link>
        </div>
    );
}
