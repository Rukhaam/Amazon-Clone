import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from "firebase/auth";
import { auth } from "../../firebase/firebase.utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial app load
  
  // === NEW: centralized UI states ===
  const [authLoading, setAuthLoading] = useState(false); // For button spinners
  const [authError, setAuthError] = useState("");

  // 1. Centralized Login Handler
  const handleLogin = async (email, password, navigate) => {
    try {
      setAuthLoading(true);
      setAuthError(""); // Clear previous errors
      
      await signInWithEmailAndPassword(auth, email, password);
      
      // Success! Navigate immediately
      navigate("/"); 
      
    } catch (err) {
      console.error(err);
      let msg = "Failed to sign in.";
      if (err.code === "auth/user-not-found") msg = "No account found with this email.";
      if (err.code === "auth/wrong-password") msg = "Incorrect password.";
      if (err.code === "auth/invalid-credential") msg = "Invalid email or password.";
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // 2. Centralized Register Handler
  const handleRegister = async (email, password, cPassword, name, navigate) => {
    try {
      setAuthLoading(true);
      setAuthError("");

      // Validation
      if (password !== cPassword) throw new Error("Passwords do not match.");
      if (password.length < 6) throw new Error("Password must be at least 6 characters.");

      // Firebase Call
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Manual State Update (for immediate UI reflection)
      setCurrentUser({ ...userCredential.user, displayName: name });

      // Success!
      navigate("/");

    } catch (err) {
      console.error(err);
      // If it's a custom validation error (like "Passwords do not match"), use that message
      // Otherwise use a generic one or map Firebase errors
      const msg = err.message.includes("Firebase") ? "Failed to create account." : err.message;
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // 3. Centralized Logout
  const handleLogout = async (navigate) => {
    try {
      await signOut(auth);
      // Optional: clear cart logic could be triggered here too if you import dispatch
      if(navigate) navigate("/signin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // 4. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    authLoading, // Expose loading state
    authError,   // Expose error state
    setAuthError,// Expose setter (in case component wants to clear error on unmount)
    handleLogin,
    handleRegister,
    handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};