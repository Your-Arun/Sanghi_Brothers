import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode"; // Import jwt-decode library

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const navigate = useNavigate();

  const checkTokenExpiration = (token) => {
    if (!token) return true; // If no token, treat it as expired

    const decoded = jwt_decode(token); // Decode the token to get the expiration time
    const currentTime = Date.now() / 1000; // Get the current time in seconds

    // If token expiration time is less than current time, the token is expired
    return decoded.exp < currentTime;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post("http://localhost:5500/login", {
        email,
        password,
      });
      const { token, user } = response.data;

      if (checkTokenExpiration(token)) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token"); // Remove expired token from localStorage
        navigate("/login"); // Redirect to login page
        return;
      }

      // Store the token and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userDepartment", user.department);
      // Redirect to the dashboard or another page after successful login
      navigate("/dashboard");
    } catch (err) {
      // Check for 401 error or other errors
      if (err.response?.status === 401) {
        alert("Invalid credentials. Please try again.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login flex justify-center items-center h-[90vh] bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-96 transition-transform transform hover:scale-105"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-600"
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
          Login
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Create an account? <a href="/signup" className="text-blue-500 hover:underline">Signup</a>
        </p>
        
        <p className="mt-2 text-center text-gray-600">
          Forgot your password? <a href="/forgot-password" className="text-blue-500 hover:underline">Reset it here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
