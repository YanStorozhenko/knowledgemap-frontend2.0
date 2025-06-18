import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, googleProvider } from "../../firebase";

import {signInWithPopup, type User} from "firebase/auth";


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
    userPanelStyle,
    logoutButtonStyle
} from "./navbarStyles";

export const navLinks = [
    // 🔹 Доступне всім користувачам
    { path: "/", label: "Головна" },

    { path: "/topics", label: "Теми" },
    { path: "/posts", label: "Пости" },
    { path: "/about", label: "Про нас" },
    { path: "/contact", label: "Контакти" },

    // 🔒 Тільки для зареєстрованих користувачів
    { path: "/map", label: "Карта знань", authOnly: true  },
    { path: "/progress", label: "Прогрес", authOnly: true },
    { path: "/tests", label: "Тести", authOnly: true },
    { path: "/codeExamples", label: "Приклади коду", authOnly: true },
    { path: "/glossary", label: "Словник термінів", authOnly: true },
    // { path: "/favorites", label: "Улюблене", authOnly: true },

    // 🛠️ Адмін-панель (тільки для адміністраторів)
    { path: "/admin/adminPage", label: "Адмін", adminOnly: true },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState <User | null>(null);

    const [role, setRole] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {


                setUser(currentUser);
                const token = await currentUser.getIdToken();
                localStorage.setItem("token", token);

                // 🔁 Отримуємо роль
                const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setRole(data.role);
                    localStorage.setItem("role", data.role);
                }
            } else {
                console.log("❌ Користувач не авторизований");
                setUser(null);
                setRole(null);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();

            // 🔐 Зберігаємо токен
            localStorage.setItem("token", token);

            // 🧠 Зберігаємо користувача в БД
            await fetch(import.meta.env.VITE_API_BASE_URL + "/users/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firebase_uid: result.user.uid,
                    email: result.user.email,
                    name: result.user.displayName,
                    avatarUrl: result.user.photoURL,
                }),
            });

            // 🔁 Отримуємо роль
            const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setRole(data.role);
                setUser(result.user);
                localStorage.setItem("role", data.role);
                localStorage.setItem("firebaseUser", JSON.stringify(result.user));

            }
        } catch (err) {
            console.error("Помилка входу:", err);
        }
    };

    const isLoggedIn = !!user;
    const isAdmin = role === "admin";


    const filteredLinks = navLinks.filter(link => {
        if (link.adminOnly) return isAdmin;
        if (link.authOnly) return isLoggedIn;
        return true;
    });

    return (
        <header className={headerWrapperStyle}>
            <div className="flex items-center gap-4 justify-between  px-4">
                <Link to="/" className={logoLinkStyle}>
                    <div>
                        <img src="/logo.png" className="logo" alt="logo" />
                    </div>
                </Link>
                <h1 className={titleStyle}>Карта знань з основ програмування</h1>
                {user ? (
                    <div className={userPanelStyle}>

                        <p>Привіт, {user.displayName?.toString().split(' ')[0] || user.email}
                        </p>
                        <p>{localStorage.getItem("role")} </p>

                        <button
                            className={logoutButtonStyle}
                            onClick={async () => {
                                await auth.signOut();
                                localStorage.removeItem("token");
                                localStorage.removeItem("role");
                            }}
                        >
                            Вийти
                        </button>
                    </div>
                ) : (
                    <div className={userPanelStyle}>
                        <p>Будь ласка, увійдіть</p>
                        <button
                            className="btn btn-primary"
                            onClick={handleGoogleLogin}
                        >
                            Увійти через Google
                        </button>
                    </div>
                )}
            </div>

            <div className={headerContainerStyle}>
                {/* Навігація десктоп */}
                <nav className={navContainerStyle}>
                    {filteredLinks.map(({ path, label }) => (
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
                    {filteredLinks.map(({ path, label }) => (
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

