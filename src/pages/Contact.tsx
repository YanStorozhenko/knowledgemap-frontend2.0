export default function Contact() {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl md:text-6xl font-bold text-center text-primary mb-4">
                Контакти
            </h1>
            <p className="text-lg md:text-xl text-center text-base-content mb-6 max-w-2xl">
                Маєш питання або пропозиції? Ми будемо раді зворотному зв’язку!
                <br />
                Напиши нам на <a href="mailto:support@knowmap.edu.ua" className="text-primary underline">support@knowmap.edu.ua</a><br />
                або заповни форму зворотного зв’язку, яку незабаром додамо.
            </p>
        </div>
    );
}
