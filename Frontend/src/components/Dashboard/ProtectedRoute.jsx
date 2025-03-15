import { useEffect, useState, useContext } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "../Dashboard/axiosInstance";
import UserContext from "../Home Page/UserContext";

const ProtectedRoute = () => {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/profile", { withCredentials: true });

        if (data?.user) {
          setUser(data.user);
        } else {
          throw new Error("Session expired");
        }
      } catch (err) {
        console.error("❌ Profile Fetch Error:", err.response?.data || err.message);
        setUser(null);
        localStorage.removeItem("user"); // ✅ Local storage se bhi user remove karo
        navigate("/login"); // ❌ Session expire hone par login page pe redirect
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setUser, navigate]);

  if (isLoading) return <h3 className="text-center mt-20">Loading...</h3>;

  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;
