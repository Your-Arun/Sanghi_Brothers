import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("manager");
  const [showPassword, setShowPassword] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Check invitation code before enabling signup
  const verifyInvitationCode = async () => {
    try {
      const response = await axios.post("http://localhost:5500/verify-invite", {
        invitationCode,
      });

      if (response.data.valid) {
        setIsCodeValid(true);
        setIsVerified(true); // Hide the button
        setError("");
      } else {
        setIsCodeValid(false);
        setError("Invalid invitation code. Please contact your admin.");
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setIsCodeValid(false);
      setError("Server error. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCodeValid) {
      alert("Please enter a valid invitation code.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5500/signup", {
        name,
        username,
        email,
        password,
        department,
        invitationCode, // Send invitation code to backend
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      alert(response.data.message || "User registered successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response) {
        alert(err.response.data.message || "Signup failed");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl transition-transform transform"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-600">
          Signup
        </h2>

        {/* Invitation Code Section */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Invitation Code"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            required
            disabled={isVerified} // Disable input after successful verification
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

        {/* Signup Fields - Show only after successful verification */}
        {isCodeValid && (
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

            {/* Password Field with Show/Hide Toggle */}
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

            {/* Department Selection */}
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
