import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import UserContext from "./UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const Login = ({ embedMode, onClose }) => {
  const { setUser } = useContext(UserContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sessionKey =
    sessionStorage.getItem("activeSession") ||
    `userSession_${Math.random().toString(36).substring(2, 11)}`;
  sessionStorage.setItem("activeSession", sessionKey);

  useEffect(() => {
    const fetchUser = async () => {
      const sessionData = sessionStorage.getItem(sessionKey);
      if (!sessionData) return;
      try {
        const { data } = await axiosInstance.get("/profile");
        setUser(data.user);
      } catch {
        sessionStorage.removeItem(sessionKey);
      }
    };
    fetchUser();
  }, [setUser, sessionKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/login", {
        identifier,
        password,
      });

      sessionStorage.setItem(sessionKey, JSON.stringify(data.user));
      sessionStorage.setItem("authToken", data.token);
      setUser(data.user);
      toast.success("Login Successful");

      if (data.user.department === "admin") {
        navigate("/admin-panel");
      } else {
        navigate(
          data.user.department === "staff" ? "/staff-dashboard" : "/dashboard"
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid credentials, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      const { data } = await axiosInstance.post("/google-login", {
        email: decoded.email,
      });

      sessionStorage.setItem(sessionKey, JSON.stringify(data.user));
      sessionStorage.setItem("authToken", data.token);
      setUser(data.user);
      toast.success("Google Login Successful");

      if (data.user.department === "admin") {
        navigate("/admin-panel");
      } else {
        navigate(
          data.user.department === "staff" ? "/staff-dashboard" : "/dashboard"
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Google Login failed or User not registered."
      );
    }
  };

  return (
    <div className="w-full relative">
      <form
        className="bg-white/90 backdrop-blur-md p-4 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-5 sm:mb-6 text-center text-blue-600">
          Login
        </h2>

        <input
          type="text"
          placeholder="Email or Phone"
          className="w-full px-3 py-2.5 sm:py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 cursor-pointer bg-transparent p-0"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-2 text-center text-gray-600 text-sm sm:text-base">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Reset it here
          </Link>
        </p>

        <div className="mt-4 flex justify-center overflow-x-auto">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Login Failed")}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
