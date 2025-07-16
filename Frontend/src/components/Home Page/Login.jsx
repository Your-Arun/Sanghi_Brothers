import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import UserContext from "./UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";

const Login = ({ embedMode, onClose }) => {
  const { setUser } = useContext(UserContext);
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



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

      const { token, user } = data; // ✅ Extract from response

      sessionStorage.setItem("authToken", token); // ✅ Store token
      sessionStorage.setItem("activeSession", JSON.stringify(user)); // ✅ Store user
      setUser(user); // ✅ Set context

      toast.success("Login Successful");

      if (data.user.department === "admin") {
        navigate("/admin-panel");
      } else {
        navigate(data.user.department === "staff" ? "/staff-dashboard" : "/dashboard");
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
    <div className="w-full relative">
      {embedMode && onClose && (
        <div
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-2xl font-bold text-gray-600 hover:text-red-600 z-50"
        >
          &times;
        </div>
      )}

      <form
        className="bg-white bg-opacity-90 backdrop-blur-md p-6 md:p-8 rounded-lg shadow-xl w-full max-w-sm md:max-w-md mx-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-5xl font-bold mb-6 text-center text-blue-600">
          Login
        </h2>

        <input
          type="text"
          placeholder="Email or Phone"
          className="w-full px-3 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-2 text-center text-gray-600">
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
