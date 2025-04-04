import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import UserContext from "./UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Generate a unique session key for each tab
  const sessionKey = sessionStorage.getItem("activeSession") || `userSession_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem("activeSession", sessionKey);

  // ✅ Restore session on page load
  useEffect(() => {
    const fetchUser  = async () => {
      const sessionData = sessionStorage.getItem(sessionKey);
      if (!sessionData) return;

      try {
        const { data } = await axiosInstance.get("/profile");
        setUser(data.user);
      } catch (error) {
        sessionStorage.removeItem(sessionKey);
      }
    };
    fetchUser ();
  }, [setUser , sessionKey]);

  // ✅ Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const { data } = await axiosInstance.post("/login", { email, password });
  
      sessionStorage.setItem(sessionKey, JSON.stringify(data.user));
      sessionStorage.setItem("authToken", data.token);
  
      setUser(data.user);
      toast.success("Login Successful");
  
      // ✅ Admin Check
      if (data.user.department === "admin") {
        navigate("/admin-panel"); // Admin ko Admin Panel bhejo
      } else {
        navigate(data.user.department === "staff" ? "/staff-dashboard" : "/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-sm md:max-w-md lg:max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-600">Login</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email & case sensitive"
          className="w-full p-3 md:p-4 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <div className="relative my-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 md:p-4 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-blue-600 text-white p-3 md:p-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Links */}
        <p className="mt-4 text-center text-sm md:text-base text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

        <p className="mt-2 text-center text-sm md:text-base text-gray-600">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Reset it here
          </Link>
        </p>
        </form>
    </div>
  );
};

export default Login;