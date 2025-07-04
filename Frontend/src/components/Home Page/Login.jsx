import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import UserContext from "./UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import loginBg from "/petrol.png"; // make sure path is correct

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sessionKey =
    sessionStorage.getItem("activeSession") ||
    `userSession_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem("activeSession", sessionKey);

  useEffect(() => {
    const fetchUser = async () => {
      const sessionData = sessionStorage.getItem(sessionKey);
      if (!sessionData) return;

      try {
        const { data } = await axiosInstance.get("/profile");
        setUser(data.user);
      } catch (error) {
        sessionStorage.removeItem(sessionKey);
      }
    };
    fetchUser();
  }, [setUser, sessionKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/login", { email, password });

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <form
          className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-white bg-opacity-90 p-6 md:p-8 rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Login</h2>

          {/* Email Field */}
          <input
            type="email"
            placeholder="Email (case-sensitive)"
            className="w-full p-3 mb-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Additional Links */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Forgot password?{" "}
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Reset here
            </Link>
          </p>
        </form>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:block w-full md:w-1/2 h-[500px] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${loginBg})`,
            clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        />
      </div>
    </div>
  );
};

export default Login;
