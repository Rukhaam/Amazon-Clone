import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
// --- NEW IMPORTS START ---
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.utils";
// --- NEW IMPORTS END ---
import { AuthContext } from "./useAuth";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLogin = async (email, password, navigate) => {
    try {
      setAuthLoading(true);
      setAuthError("");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      let msg = "Failed to sign in.";
      if (err.code === "auth/user-not-found")
        msg = "No account found with this email.";
      if (err.code === "auth/wrong-password") msg = "Incorrect password.";
      if (err.code === "auth/invalid-credential")
        msg = "Invalid email or password.";
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (email, password, cPassword, name, navigate) => {
    try {
      setAuthLoading(true);
      setAuthError("");

      if (password !== cPassword) throw new Error("Passwords do not match.");
      if (password.length < 6)
        throw new Error("Password must be at least 6 characters.");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(userCredential.user, { displayName: name });

      // We set the user immediately for UI responsiveness
      setCurrentUser({ ...userCredential.user, displayName: name });
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg = err.message.includes("Firebase")
        ? "Failed to create account."
        : err.message;
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async (navigate) => {
    try {
      await signOut(auth);
      if (navigate) navigate("/signin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleResetPassword = async (email) => {
    try {
      setAuthLoading(true);
      setAuthError("");
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      console.error(err);
      let msg = "Failed to send reset email.";
      if (err.code === "auth/user-not-found")
        msg = "No account found with this email.";
      if (err.code === "auth/invalid-email")
        msg = "Please enter a valid email address.";
      setAuthError(msg);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // --- THIS IS THE PART THAT WAS MISSING ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 1. User is logged in. Now check the Database for "isAdmin"
        const userDocRef = doc(db, "users", user.uid);

        try {
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            // 2. Combine the Auth User + Database Data
            // This pulls in { isAdmin: true } from your screenshot
            setCurrentUser({ ...user, ...userSnapshot.data() });
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    authLoading,
    authError,
    setAuthError,
    handleLogin,
    handleRegister,
    handleLogout,
    handleResetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
