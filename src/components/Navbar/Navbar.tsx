import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import {
    linkStyle,
    logoLinkStyle,
    mobileLinkStyle,
    navContainerStyle,
    burgerButtonStyle,
    desktopUserPanelStyle,
    mobileNavStyle,
    headerContainerStyle,
    headerWrapperStyle,
    titleStyle,
} from "./navbarStyles";

// import { useAuth } from "../../context/AuthContext";
// import UserPanel from "../UserPanel/UserPanel";

export const navLinks = [
    // 🔹 Доступне всім користувачам
    { path: "/", label: "Головна" },
    { path: "/map", label: "Карта знань" },
    { path: "/topics", label: "Теми" },
    { path: "/posts", label: "Пости" },
    { path: "/about", label: "Про нас" },
    { path: "/contact", label: "Контакти" },

    // 🔒 Тільки для зареєстрованих користувачів
    { path: "/progress", label: "Прогрес", authOnly: true },
    { path: "/tests", label: "Тести", authOnly: true },
    { path: "/codeExamples", label: "Приклади коду", authOnly: true },
    { path: "/glossary", label: "Словник термінів", authOnly: true },
    { path: "/favorites", label: "Улюблене", authOnly: true },

    // 🛠️ Адмін-панель (тільки для адміністраторів)
    { path: "/admin/adminEditorPage", label: "Адмін", adminOnly: true },
];


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            if (currentUser) {
                console.log("👤 Користувач авторизований:", currentUser);
                setUser(currentUser);
            } else {
                console.log("❌ Користувач не авторизований");
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);



    // const { user, role, loading } = useAuth();
    // const isLoggedIn = !!user;
    // const isAdmin = role === "admin";

    // if (loading) return null;

    return (
        <header className={headerWrapperStyle}>
            <div className="flex items-center gap-4">
                <Link to="/" className={logoLinkStyle}>
                    <div>
                        <img src="/logo.png" className="logo" alt="logo" />
                    </div>
                </Link>
                <h1 className={titleStyle}>Карта знань з основ програмування</h1>
                {user ? (
                    <p>Привіт, {user.displayName}</p>
                ) : (
                    <p>Будь ласка, увійдіть</p>
                )}
            </div>

            <div className={headerContainerStyle}>
                {/* Навігація десктоп */}
                <nav className={navContainerStyle}>
                    {navLinks.map(({ path, label }) => (
                        <Link key={path} to={path} className={linkStyle}>
                            {label}
                        </Link>
                    ))}
                    {/* {isLoggedIn && <Link to="/favorites" className={linkStyle}>Улюблене</Link>} */}
                    {/* {isAdmin && <Link to="/admin/adminEditorPage" className="text-orange-400 font-semibold hover:text-orange-300">Адмін</Link>} */}
                </nav>

                {/* Панель користувача справа */}
                <div className={desktopUserPanelStyle}>
                    {/* <UserPanel /> */}
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
                    {navLinks.map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            onClick={() => setIsOpen(false)}
                            className={mobileLinkStyle}
                        >
                            {label}
                        </Link>
                    ))}
                    {/* {isLoggedIn && <Link to="/favorites" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Улюблене</Link>} */}
                    {/* {isAdmin && <Link to="/admin/adminEditorPage" onClick={() => setIsOpen(false)} className="text-orange-400 font-semibold">Адмін</Link>} */}
                    <div className="mt-4">
                        {/* <UserPanel /> */}
                    </div>
                </nav>
            )}
        </header>
    );
}
