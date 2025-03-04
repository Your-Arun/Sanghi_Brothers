import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("manager"); // Default department
  const [showPassword, setShowPassword] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [userRole, setUserRole] = useState(""); // New state for user role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Verify Invitation Code
  const verifyInvitationCode = async () => {
    try {
      const response = await axios.post("http://localhost:5500/verify-invite", {
        invitationCode,
      });

      if (response.data.valid) {
        setIsVerified(true);
        setUserRole(response.data.department); // "staff" or "member"
        setError("");
      } else {
        setError("Invalid invitation code. Please contact your admin.");
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("Server error. Please try again later.");
    }
  };

  // ✅ Handle Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert("Please verify the invitation code first.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5500/signup", {
        name,
        username,
        email,
        password,
        department: userRole === "staff" ? "staff" : department, // Auto-set staff department
        invitationCode,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      alert(response.data.message || "User registered successfully");

      navigate(userRole === "staff" ? "/staff-dashboard" : "/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-600">
          Signup
        </h2>

        {/* Invitation Code */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Invitation Code"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            required
            disabled={isVerified}
          />
          {!isVerified && (
            <button
              type="button"
              className="w-full mt-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
              onClick={verifyInvitationCode}
            >
              Verify Code
            </button>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* ✅ Show Role after Verification */}
        {isVerified && (
          <p className="text-lg font-semibold text-center text-gray-700 mb-4">
            🎉 Verified! You are signing up as:{" "}
            <span className="text-blue-600 font-bold">
              {userRole === "staff" ? "Staff" : "Member"}
            </span>
          </p>
        )}

        {/* Signup Form (Only show after verification) */}
        {isVerified && (
          <>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Input */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Department Selection - Hide if Staff */}
            {userRole !== "staff" && (
              <select
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="manager">MANAGER</option>
                <option value="accounts/finance">ACCOUNTS/FINANCE</option>
                <option value="backoffice">BACK OFFICE</option>
              </select>
            )}

            {/* Signup Button */}
            <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300">
              Signup
            </button>
          </>
        )}

        {/* Login Link */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
