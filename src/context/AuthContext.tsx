import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

import { auth } from "../firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    token: string | null;
    role: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    token: null,
    role: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);


            if (currentUser) {
                const token = await currentUser.getIdToken();
                setToken(token);
                localStorage.setItem("token", token);


                try {
                    const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/auth/protected", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(currentUser);

                    const data = await res.json();
                    setRole(data.user.role);
                } catch (err) {
                    console.error("Помилка отримання ролі:", err);
                    setRole(null);
                }
            } else {
                setToken(null);
                localStorage.removeItem("token");
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    return (
        <AuthContext.Provider value={{ user, loading, token, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
