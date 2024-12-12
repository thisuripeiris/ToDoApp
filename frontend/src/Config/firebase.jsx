// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCp4ABOrzvW3OJFlRi_bJHaGS7cFK-Ai3E",
    authDomain: "login-auth-7eb5f.firebaseapp.com",
    projectId: "login-auth-7eb5f",
    storageBucket: "login-auth-7eb5f.firebasestorage.app",
    messagingSenderId: "134998032581",
    appId: "1:134998032581:web:0180da435e18453fb370ac",
    measurementId: "G-7EB40ST4C1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;