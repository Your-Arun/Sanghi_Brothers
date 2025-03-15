import { useEffect, useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosInstance from "../Dashboard/axiosInstance";
import UserContext from "../Home Page/UserContext";

const ProtectedRoute = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await axiosInstance.get("/profile");
        setUser({ id: data.userId });
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) return <h3>Loading...</h3>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
