import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup, type User } from "firebase/auth";

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
    logoutButtonStyle,
    userInfoWrapperStyle,
    userInfoTextStyle,
} from "./navbarStyles";

export const navLinks = [
    { path: "/", label: "Головна" },
    { path: "/topics", label: "Теми" },
    { path: "/posts", label: "Пости" },
    { path: "/about", label: "Про нас" },
    { path: "/contact", label: "Контакти" },
    { path: "/map", label: "Карта знань", authOnly: true },
    { path: "/progress", label: "Прогрес", authOnly: true },
    { path: "/tests", label: "Тести", authOnly: true },
    { path: "/codeExamples", label: "Приклади коду", authOnly: true },
    { path: "/glossary", label: "Словник термінів", authOnly: true },
    { path: "/admin/adminPage", label: "Адмін", adminOnly: true },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const token = await currentUser.getIdToken();
                localStorage.setItem("token", token);

                const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setRole(data.role);
                    localStorage.setItem("role", data.role);
                }
            } else {
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
            localStorage.setItem("token", token);

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

            const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/me", {
                headers: { Authorization: `Bearer ${token}` },
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
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 gap-2">
                <div className="flex items-center gap-4">
                    <Link to="/" className={logoLinkStyle}>
                        <img src="/logo.png" className="logo" alt="logo" />
                    </Link>
                    <h1 className={titleStyle}>Карта знань з основ програмування</h1>
                </div>

                {user ? (
                    <div className={userInfoWrapperStyle}>
                        <p className={userInfoTextStyle}>Привіт, {user.displayName?.split(" ")[0] || user.email}</p>
                        <p className={userInfoTextStyle}>{role}</p>
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
                    <div className={userInfoWrapperStyle}>

                        <button className="btn btn-primary" onClick={handleGoogleLogin}>
                            Увійти через Google
                        </button>
                    </div>
                )}
            </div>

            <div className={headerContainerStyle}>
                <nav className={navContainerStyle}>
                    {filteredLinks.map(({ path, label }) => (
                        <Link key={path} to={path} className={linkStyle}>
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className={desktopUserPanelStyle} />

                <button className={burgerButtonStyle} onClick={() => setIsOpen(!isOpen)}>
                    ☰
                </button>
            </div>

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
                </nav>
            )}
        </header>
    );
}