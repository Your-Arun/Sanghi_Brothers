import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  console.log("🔍 Checking Auth Token:", token); // ✅ Debugging Line
  return token !== null && token !== undefined;
};

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    alert("Please sign up or log in to continue.");
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
