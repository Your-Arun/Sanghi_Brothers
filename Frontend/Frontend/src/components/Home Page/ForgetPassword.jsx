import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Reset Password
  const [message, setMessage] = useState("");
  const[error,setError]=useState("");
  const[success,setSuccess]=useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5500/forgot-password", { email });
      setMessage(response.data.message);
      setStep(2); // Move to the next step to enter OTP
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage(error.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


      // Log the data being sent
  console.log("Sending data to reset password:", {
    email,
    otp,
    newPassword,
  });
  
    try {
      const response = await axios.post("http://localhost:5500/reset-password",
         {
        email,
        otp,
        newPassword,
      });
      setSuccess(response.data.message);
      setError("");
      alert("Suceess") // Clear any previous errors
      // Optionally redirect to login or another page after successful reset
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(error.response?.data?.message || "Failed to reset password.");
      setSuccess(""); // Clear any previous success messages
    }
  };

  return (
    <div className="flex items-center justify-center h-[90vh]">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
        {message && <p className="text-red-500">{message}</p>}
        
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
              Send OTP
            </button>
                  
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
              Reset Password
            </button>
       
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;