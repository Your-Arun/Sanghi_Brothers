import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import UserContext from "./UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const Login = ({ switchToSignup }) => {
  const { setUser } = useContext(UserContext);
  const[identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const[showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sessionKey = sessionStorage.getItem("activeSession") || `userSession_${Math.random().toString(36).substring(2, 11)}`;
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
      const { data } = await axiosInstance.post("/login", { identifier, password });
      sessionStorage.setItem(sessionKey, JSON.stringify(data.user));
      sessionStorage.setItem("authToken", data.token);
      setUser(data.user);
      toast.success("Welcome back!");

      if (data.user.department === "admin") navigate("/admin-panel");
      else navigate(data.user.department === "staff" ? "/staff-dashboard" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      const { data } = await axiosInstance.post("/google-login", { email: decoded.email });
      sessionStorage.setItem(sessionKey, JSON.stringify(data.user));
      sessionStorage.setItem("authToken", data.token);
      setUser(data.user);
      toast.success("Google Login Successful");

      if (data.user.department === "admin") navigate("/admin-panel");
      else navigate(data.user.department === "staff" ? "/staff-dashboard" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "User not registered.");
    }
  };

  return (
    <form className="w-full flex flex-col" onSubmit={handleSubmit}>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back 👋</h2>
        <p className="text-gray-500 mt-2 text-sm font-medium">Enter your details to securely sign in.</p>
      </div>

      <div className="space-y-5">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          </div>
          <input
            type="text"
            placeholder="Email or Phone Number"
            className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-[15px] font-medium text-gray-900"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-12 pr-12 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-[15px] font-medium text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-orange-500 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 mb-8">
        <button type="button" onClick={() => navigate("/forgot-password")} className="text-sm font-bold text-orange-600 hover:text-orange-500">
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 text-white py-4 rounded-2xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:shadow-orange-500/50 transition-all font-bold text-[15px] tracking-wide disabled:opacity-70"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-200"></div>
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or login with</p>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="flex justify-center w-full overflow-hidden rounded-2xl[&>div]:w-full">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google Login Failed")} />
      </div>

      <p className="mt-8 text-center text-[15px] text-gray-600 font-medium">
        Don't have an account?{" "}
        <button type="button" onClick={switchToSignup} className="font-bold text-orange-600 hover:text-orange-500 transition-colors">
          Sign up
        </button>
      </p>
    </form>
  );
};

export default Login;