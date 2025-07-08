import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../Dashboard/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Reset Password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const navigate = useNavigate();

  // ✅ Send OTP or Reset Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      let requestData = { email };

      if (step === 2) {
        if (!/^\d{6}$/.test(otp)) throw new Error("OTP must be 6 digits.");
        if (newPassword.length < 6) throw new Error("Password must be at least 6 characters.");
        if (newPassword !== confirmPassword) throw new Error("Passwords do not match.");

        requestData = { ...requestData, otp, newPassword };
      }

      const response = await axiosInstance.post("/forgot-password", requestData);

      if (step === 1) {
        setMessage(response.data.message);
        setStep(2);
        setResendDisabled(true);

        // Enable Resend OTP after 60 seconds
        setTimeout(() => setResendDisabled(false), 60000);
      } else {
        setMessage(response.data.message);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {message && <p className="text-green-500 text-center mb-2">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border rounded w-full p-2 text-center tracking-widest"
                  required
                  maxLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border rounded w-full p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border rounded w-full p-2"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className={`bg-blue-500 text-white p-2 rounded w-full ${
              loading || (step === 1 && !email) || (step === 2 && (!otp || !newPassword || !confirmPassword))
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={loading || (step === 1 && !email) || (step === 2 && (!otp || !newPassword || !confirmPassword))}
          >
            {loading ? "Processing..." : step === 1 ? "Send OTP" : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {step === 1 ? (
            <>
              Remembered your password?{" "}
              <Link to="/home" className="text-blue-500 hover:underline">
                Login
              </Link>
            </>
          ) : (
            <>
              Didn't receive OTP?{" "}
              <button
                onClick={() => setStep(1)}
                className={`text-blue-500 hover:underline ${resendDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={resendDisabled}
              >
                Resend OTP {resendDisabled && "(Wait 60s)"}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;