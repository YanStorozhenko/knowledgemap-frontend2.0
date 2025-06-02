import { Link } from "react-router-dom";
import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import UserPanel from "../UserPanel/UserPanel";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    // const { user, role, loading } = useAuth();
    // const isLoggedIn = !!user;
    // const isAdmin = role === "admin";

    // if (loading) return null;

    const linkStyle = "text-cyan-200 hover:text-pink-300 transition-colors";
    // const navContainerStyle = "flex gap-6 flex-wrap justify-center flex-1 mx-8 hidden md:flex";


    const mobileLinkStyle = `${linkStyle} text-lg`;


    const burgerButtonStyle = "md:hidden text-cyan-200 text-3xl ml-auto";
    const desktopUserPanelStyle = "hidden md:block ml-auto";
    const mobileNavStyle = "md:hidden flex flex-col items-center gap-3 pb-4 bg-[#0a0f1f]";
    const headerContainerStyle = "max-w-7xl mx-auto px-4 py-4 flex items-center justify-between";
    const headerWrapperStyle = "bg-[#0a0f1f] shadow-lg z-10";

    return (
        <header className={headerWrapperStyle}>
            <div className={headerContainerStyle}>

                {/* Навігація десктоп */}
                <nav className="hidden md:flex gap-6 flex-wrap justify-center flex-1 mx-8">
                    {/*<nav className={navContainerStyle}>*/}
                        <Link to="/" className={linkStyle}>Головна</Link>
                        <Link to="/locations" className={linkStyle}>Локації</Link>
                        <Link to="/tours" className={linkStyle}>Тури</Link>
                        <Link to="/posts" className={linkStyle}>Пости</Link>
                        <Link to="/interestingPhotos" className={linkStyle}>Фото</Link>
                        <Link to="/equipment" className={linkStyle}>Обладнання</Link>
                        {/*{isLoggedIn && <Link to="/favorites" className={linkStyle}>Улюблене</Link>}*/}
                        <Link to="/about" className={linkStyle}>Про нас</Link>
                        <Link to="/contact" className={linkStyle}>Контакти</Link>
                        {/*{isAdmin && <Link to="/admin/adminEditorPage" className="text-orange-400 font-semibold hover:text-orange-300">Адмін</Link>}*/}
                    </nav>

                    {/* Панель користувача справа */}
                    <div className={desktopUserPanelStyle}>
                        {/*<UserPanel />*/}
                    </div>

                    {/* Бургер */}
                    <button
                        className={burgerButtonStyle}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        ☰
                    </button>
            </div>

            {/* Мобільне меню */}
            {isOpen && (
                <nav className={mobileNavStyle}>
                    <Link to="/" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Головна</Link>
                    <Link to="/locations" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Локації</Link>
                    <Link to="/tours" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Тури</Link>
                    <Link to="/posts" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Пости</Link>
                    <Link to="/interestingPhotos" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Фото</Link>
                    <Link to="/equipment" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Обладнання</Link>
                    {/*{isLoggedIn && <Link to="/favorites" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Улюблене</Link>}*/}
                    <Link to="/about" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Про нас</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Контакти</Link>
                    {/*{isAdmin && <Link to="/admin/adminEditorPage" onClick={() => setIsOpen(false)} className="text-orange-400 font-semibold">Адмін</Link>}*/}
                    <div className="mt-4">
                        {/*<UserPanel />*/}
                    </div>
                </nav>
            )}
        </header>
    );
}
