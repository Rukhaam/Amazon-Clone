import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../src/context/auth.context";

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // 1. Check if logged in
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // 2. Check Admin Status 
  // (Note: For a real app, you'd check a database field. 
  // For a clone, we can check the email or a custom claim)
  const isAdmin = currentUser.email === "rukhaammushtaq19@gmail.com"; 
  // OR if you synced the 'isAdmin' field to context: 
  // const isAdmin = currentUser.isAdmin;

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;