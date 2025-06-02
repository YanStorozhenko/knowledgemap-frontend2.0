import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl md:text-6xl font-bold text-center text-primary mb-4">
                Інтерактивна карта знань
            </h1>
            <p className="text-lg md:text-xl text-center text-base-content mb-6 max-w-2xl">
                Ласкаво просимо до інтерактивної карти знань з програмування!<br/>
                Це твій особистий провідник у світ алгоритмів, структур даних, мов програмування та логіки. <br/>
                Рухайся по темах, відкривай нові горизонти та відстежуй свій прогрес — крок за кроком до впевненого
                володіння основами програмування.
            </p>
            <Link to="/login" className="btn btn-primary text-lg">
                Почати навчання
            </Link>
        </div>
    );
}
