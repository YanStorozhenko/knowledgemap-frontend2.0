export default function About() {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl md:text-6xl font-bold text-center text-primary mb-4">
                Про проєкт
            </h1>
            <p className="text-lg md:text-xl text-center text-base-content mb-6 max-w-2xl">
                Цей проєкт створено з метою зробити навчання програмуванню більш інтерактивним та доступним.
                <br />
                Карта знань дозволяє візуалізувати теми, відслідковувати прогрес і знаходити зв’язки між концепціями. <br />
                Розроблено для студентів, викладачів та всіх, хто прагне розібратися в основах інформатики.
            </p>
        </div>
    );
}
