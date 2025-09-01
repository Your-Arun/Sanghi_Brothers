import React, { useState } from "react";
import axiosInstance from '../Dashboard/axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = ({ embedMode, onClose }) => {
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
        if (response.data.type === "staff") {
          setDepartment("staff");
        }
      } else {
        alert("Invalid invitation code");
      }
    } catch (err) {
      alert("Error verifying invitation code");
    } finally {
      setLoading(false);
    }
  };

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

      toast.success(response.data.message || "User registered successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Close Button */}
      {onClose && (
        <div
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-xl font-bold text-gray-600 hover:text-red-600 z-50"
        >
          &times;
        </div>
      )}

      <form
        className="bg-white bg-opacity-90 backdrop-blur-md p-4 md:p-6 rounded-lg shadow-lg w-full max-w-xs md:max-w-sm mx-auto"
        onSubmit={isValidInviteCode ? handleSubmit : handleInviteCodeVerification}
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Signup</h2>

        {!isValidInviteCode ? (
          <>
            <input
              type="text"
              placeholder="Enter Invitation Code"
              className="w-full px-2 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Invitation Code"}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-base font-semibold text-green-600 text-center mb-3">
              Welcome as <span className="uppercase text-red-600">{type}❗</span>
            </h1>

            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-2 py-2 mb-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Username"
              className="w-full px-2 py-2 mb-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full px-2 py-2 mb-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="tel"
              placeholder="Phone"
              className="w-full px-2 py-2 mb-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="absolute top-1/2 right-2 cursor-pointer transform -translate-y-1/2 text-gray-600 text-xs"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </div>
            </div>

            {type !== "staff" && (
              <select
                className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                <option value="manager">MANAGER</option>
                <option value="accounts/finance">ACCOUNTS/FINANCE</option>
                <option value="backoffice">BACK OFFICE</option>
              </select>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200 text-sm"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Signup;
