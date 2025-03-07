import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Icons for better UX

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDepartment, setUserDepartment] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const  data  = await axios.get("http://localhost:5500/departments", {
          withCredentials: true, // ✅ Ensure cookies are sent
        });

        setUserDepartment(data.data[3]); // ✅ Fetch from backend instead of localStorage
        console.log(data.data[3])
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // ✅ Pehle user ko login karna
      await axios.post(
        "http://localhost:5500/login",
        { email, password },
        { withCredentials: true }
      );
  
      console.log("Login Successful");
  
      // ✅ Department ke basis pe navigate karna
      if (userDepartment) {
        navigate("/staff-dashboard");
      } else {
        navigate("/dashboard");
      }
      
    } catch (err) {
      console.error("Login Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-600">Login</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Links */}
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? {" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

        <p className="mt-2 text-center text-gray-600">
          Forgot your password? {" "}
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Reset it here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
