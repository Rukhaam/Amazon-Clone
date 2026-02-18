import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../src/context/useAuth";

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  console.log("Admin Check:", {
    email: currentUser?.email,
    isAdmin: currentUser?.isAdmin,
    uid: currentUser?.uid,
  });

  // 1. Check if logged in
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // 2. Check the Database Field (This matches your screenshot)
  // We removed the email check and replaced it with this:
  if (currentUser.isAdmin !== true) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
