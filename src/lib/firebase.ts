import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaw9YBA2rEK9rLjVcX9cMVHIvcHGQk1aY",
  authDomain: "logistics-9593b.firebaseapp.com",
  projectId: "logistics-9593b",
  storageBucket: "logistics-9593b.firebasestorage.app",
  messagingSenderId: "1015497617576",
  appId: "1:1015497617576:web:7605ecc31b4d299d1f529d",
  measurementId: "G-WCE1W1G42M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
