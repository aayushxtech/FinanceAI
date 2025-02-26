import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDIYSZuKN_EDBZQMKjDBsj0uMDOrl-OBko",
  authDomain: "financeai-d0ac9.firebaseapp.com",
  projectId: "financeai-d0ac9",
  storageBucket: "financeai-d0ac9.appspot.com",
  messagingSenderId: "109862893843",
  appId: "1:109862893843:android:28dcb8895b4c55355842e6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
