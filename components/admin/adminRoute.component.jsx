import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../src/context/auth.context";

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  const isAdmin = currentUser.email === "rukhaammushtaq19@gmail.com"; 
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};

export default AdminRoute;