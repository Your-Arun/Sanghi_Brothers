import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "../Dashboard/axiosInstance";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const [step, setStep] = useState("login"); // 'login' → 'invite'
  const [userData, setUserData] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post("/google-auth", {
        token: credentialResponse.credential,
      });

      setUserData(res.data.user); // Store email for invite code verification
      setStep("invite"); // Move to invite code screen
    } catch (err) {
      console.error("Google Auth failed:", err.response?.data?.message || err.message);
    }
  };

  const handleInviteVerification = async () => {
    if (!inviteCode) return alert("Please enter invite code");

    setLoading(true);
    try {
      const res = await axiosInstance.post("/verify-invite", {
        invitecode: inviteCode,
        email: userData.email, // You can also link this if needed
      });

      if (res.data.valid) {
        // Save token and navigate based on role/type
        localStorage.setItem("token", res.data.token);
        alert("Logged in successfully!");

        if (res.data.type === "staff") {
          navigate("/staff-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert("Invalid invite code");
      }
    } catch (err) {
      console.error("Invite Code verification failed:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {step === "login" ? (
        <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login Failed")} />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-xl font-bold mb-4 text-center">Enter Invite Code</h2>
          <input
            type="text"
            placeholder="Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={handleInviteVerification}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;
