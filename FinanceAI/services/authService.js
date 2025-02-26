import { auth } from "../firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";

// Register User
export const register = async (email, password, userData) => {
  let userCredential = null;
  try {
    // Create auth user
    userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Store additional user data in Firestore
    const db = getFirestore();
    await setDoc(doc(db, "users", userCredential.user.uid), {
      ...userData,
      createdAt: new Date(),
    });

    return userCredential;
  } catch (error) {
    // If Firestore fails, delete the auth user to maintain consistency
    if (userCredential?.user) {
      try {
        await deleteUser(userCredential.user);
      } catch (deleteError) {
        console.error("Cleanup failed:", deleteError);
      }
    }

    let errorMessage = "Registration failed";
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "This email is already registered";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      case "auth/weak-password":
        errorMessage = "Password should be at least 6 characters";
        break;
      default:
        errorMessage = error.message || "An unexpected error occurred";
    }
    throw new Error(errorMessage);
  }
};

// Login User
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// Logout User
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};
