import React, { useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
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
        toast.error("Invalid invitation code");
      }
    } catch (err) {
      toast.error("Error verifying invitation code");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidInviteCode) {
      toast.warn("Please verify your invitation code first");
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
          >
            &times;
          </button>
        )}

        <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-6">
          Signup
        </h2>

        <form
          onSubmit={
            isValidInviteCode ? handleSubmit : handleInviteCodeVerification
          }
          className="flex flex-col gap-4"
        >
          {!isValidInviteCode ? (
            <>
              <input
                type="text"
                placeholder="Enter Invitation Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Invitation Code"}
              </button>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-green-600 text-center">
                Welcome as{" "}
                <span className="uppercase text-red-600">{type}❗</span>
              </h1>

              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="tel"
                placeholder="Phone"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-sm text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </div>
              </div>

              {type !== "staff" && (
                <select
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
