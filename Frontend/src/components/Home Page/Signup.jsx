import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("manager");
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isValidInviteCode, setIsValidInviteCode] = useState(false);
  const navigate = useNavigate();

  // Handle Invitation Code Verification
  const handleInviteCodeVerification = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5500/verify-invite", {
        invitecode: inviteCode,
      });

      if (response.data.valid) {
        setIsValidInviteCode(true);
      } else {
        alert("Invalid invitation code");
      }
    } catch (err) {
      alert("Error verifying invitation code");
    }
  };

  // Handle Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidInviteCode) {
      alert("Please verify your invitation code first");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5500/signup", {
        name,
        username,
        email,
        phone,
        password,
        department,
      });

      if (response.data.token) {
        localSession.setItem("token", response.data.token);
      }

      alert(response.data.message || "User registered successfully");

      // Navigate based on department
      if (department === "staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl"
        onSubmit={isValidInviteCode ? handleSubmit : handleInviteCodeVerification}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-600">
          Signup
        </h2>

        {!isValidInviteCode && (
          <div>
            <input
              type="text"
              placeholder="Invitation Code"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Verify Invitation Code
            </button>
          </div>
        )}

        {isValidInviteCode && (
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="tel"
              placeholder="Phone"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg"
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

            <select
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="manager">MANAGER</option>
              <option value="accounts/finance">ACCOUNTS/FINANCE</option>
              <option value="backoffice">BACK OFFICE</option>
              <option value="staff">STAFF</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Signup
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;