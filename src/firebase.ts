import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyC6ffjKSvqRJ-W4IymbgJXfqtTEUoukwGo",
    authDomain: "knowledge-map-2613.firebaseapp.com",
    projectId: "knowledge-map-2613",
    storageBucket: "knowledge-map-2613.firebasestorage.app",
    messagingSenderId: "971045220627",
    appId: "1:971045220627:web:c71eb925068d5919b9eae6",
    measurementId: "G-DWRCX9X7W2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
