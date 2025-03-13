import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axiosInstance.get("/profile", { withCredentials: true }); // ✅ Cookies ke sath request
        setIsAuthenticated(true);
      } catch (err) {
        console.error("🚨 Not Authenticated:", err.response?.data || err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p className="text-center mt-10">🔄 Checking session...</p>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
