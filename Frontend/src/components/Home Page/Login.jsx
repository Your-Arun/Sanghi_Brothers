import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import UserContext from "./UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const LoginPage = ({ switchToSignup }) => {
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
      toast.success("Welcome back!");

      if (data.user.department === "admin") navigate("/admin-panel");
      else
        navigate(
          data.user.department === "staff"
            ? "/staff-dashboard"
            : "/dashboard"
        );
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials.");
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

      if (data.user.department === "admin") navigate("/admin-panel");
      else
        navigate(
          data.user.department === "staff"
            ? "/staff-dashboard"
            : "/dashboard"
        );
    } catch (err) {
      toast.error(err.response?.data?.message || "User not registered.");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
        <form className="w-full flex flex-col" onSubmit={handleSubmit}>
          
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome Back 👋
            </h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              Enter your details to securely sign in.
            </p>
          </div>

          {/* Email / Phone */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Email or Phone Number"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-orange-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-5">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-semibold text-orange-600 hover:text-orange-500"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl shadow-md hover:bg-orange-600 transition-all font-bold text-sm disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-200"></div>
            <p className="px-3 text-xs font-bold text-gray-400 uppercase">
              Or login with
            </p>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center scale-95">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Login Failed")}
            />
          </div>

          {/* Signup Switch */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={switchToSignup}
              className="font-bold text-orange-600 hover:text-orange-500"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;