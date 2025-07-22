import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";

const OAuthCallback = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthLogin = async () => {
      try {
        // Get user session from backend
        const { data } = await axiosInstance.get("/auth ", {
          withCredentials: true,
        });

        const sessionKey =
          sessionStorage.getItem("activeSession") ||
          `userSession_${Math.random().toString(36).substring(2, 11)}`;
        sessionStorage.setItem("activeSession", sessionKey);
        sessionStorage.setItem(sessionKey, JSON.stringify(data.user));
        sessionStorage.setItem("authToken", data.token);
        setUser(data.user);
        toast.success("Login Successful");

        // Redirect based on department
        if (data.user.department === "admin") {
          navigate("/admin-panel");
        } else {
          navigate(data.user.department === "staff" ? "/staff-dashboard" : "/dashboard");
        }
      } catch (err) {
        toast.error("OAuth login failed. Please try again.");
        navigate("/");
      }
    };

    handleOAuthLogin();
  }, [setUser, navigate]);

  return <p className="text-center mt-10">Signing you in...</p>;
};

export default OAuthCallback;
