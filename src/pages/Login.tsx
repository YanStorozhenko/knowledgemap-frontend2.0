import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            const token = await result.user.getIdToken(true);


            localStorage.setItem("token", token);
            navigate("/");
        } catch (error) {
            console.error("Помилка входу:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-base-200">
            <h1 className="text-3xl font-bold mb-6">Увійдіть до карти знань</h1>
            <button
                className="btn btn-primary"
                onClick={handleGoogleLogin}
            >
                Увійти через Google
            </button>
        </div>
    );
}
