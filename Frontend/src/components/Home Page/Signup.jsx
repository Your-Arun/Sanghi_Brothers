import React, { useState } from "react";
import axiosInstance from '../Dashboard/axiosInstance'
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [type, setType] = useState("");
  const [isValidInviteCode, setIsValidInviteCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Invitation Code Verification
  const handleInviteCodeVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/verify-invite", {
        invitecode: inviteCode,
      });

      if (response.data) {
        setIsValidInviteCode(response.data.valid);
        setType(response.data.type);
      } else {
        alert("Invalid invitation code");
      }
    } catch (err) {
      alert("Error verifying invitation code");
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidInviteCode) {
      alert("Please verify your invitation code first");
      return;
    }
    setLoading(true);

    try {
      const response = await axiosInstance.post("/signup", {
        name,
        username,
        email,
        phone,
        password,
        department,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      alert(response.data.message || "User  registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg"
        onSubmit={isValidInviteCode ? handleSubmit : handleInviteCodeVerification}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-6">
          Signup
        </h2>

        {!isValidInviteCode ? (
          <div>
            <input
              type="text"
              placeholder="Enter Invitation Code"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Invitation Code"}
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-semibold text-green-600 text-center mb-4">
              Welcome as <span className="uppercase text-red-600">{type}❗</span>
            </h1>

            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="tel"
              placeholder="Phone"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              <option value="manager">MANAGER</option>
              <option value="accounts/finance">ACCOUNTS/FINANCE</option>
              <option value="backoffice">BACK OFFICE</option>
              <option value="staff">STAFF</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </div>
        )}

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