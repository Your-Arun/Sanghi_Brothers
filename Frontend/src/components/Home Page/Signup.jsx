import React, { useState } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { User, Mail, Phone, Lock, Eye, EyeOff, KeyRound, Briefcase, CheckCircle2 } from "lucide-react";

const Signup = ({ switchToLogin }) => {
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
      const response = await axiosInstance.post("/verify-invite", { invitecode: inviteCode });
      
      // ✅ FIX: Form fully unlock ho jayega on successful verification
      if (response.data) {
        const isCodeValid = response.data.valid !== undefined ? response.data.valid : true;
        
        if (isCodeValid) {
          setIsValidInviteCode(true); // Focibly open the next step
          setType(response.data.type || "User");
          if (response.data.type === "staff") setDepartment("staff");
          toast.success("Invite code verified!");
        } else {
          toast.error("Invalid invitation code");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error verifying invitation code");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      setName(decoded.name || "");
      setEmail(decoded.email || "");
      setUsername(decoded.email?.split("@")[0] || "");
      setPhone("");
      toast.success("Google Auth successful, complete details.");
    } catch (err) {
      toast.error("Google authentication failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidInviteCode) return toast.error("Verify invite code first");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/signup", { name, username, email, phone, password, department });
      if (response.data.token) localStorage.setItem("token", response.data.token);
      toast.success(response.data.message || "Account created successfully");
      
      if (switchToLogin) switchToLogin();
      else navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full flex flex-col" onSubmit={isValidInviteCode ? handleSubmit : handleInviteCodeVerification}>
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Create Account ✨</h2>
        <p className="text-gray-500 mt-1.5 text-sm font-medium">Join us today to manage your workflow.</p>
      </div>

      {!isValidInviteCode ? (
        <div className="space-y-5 animate-fade-in">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            </div>
            <input
              type="text"
              placeholder="Enter Invitation Code"
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-[15px] font-medium text-gray-900"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3.5 rounded-2xl hover:bg-gray-800 hover:shadow-lg transition-all font-bold text-[15px] tracking-wide disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 mb-2 flex items-center gap-3">
            <div>
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Verified Access</p>
              <p className="text-sm font-semibold text-green-900 capitalize">Role: {type}</p>
            </div>
          </div>

          <div className="flex justify-center w-full overflow-hidden rounded-2xl [&>div]:w-full">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google Login Failed")} />
          </div>

          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-gray-200"></div>
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or register</p>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              </div>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-[14px] font-medium text-gray-900" />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              </div>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-[14px] font-medium text-gray-900" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            </div>
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-[14px] font-medium text-gray-900" />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            </div>
            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required
              className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-[14px] font-medium text-gray-900" />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            </div>
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full pl-12 pr-12 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-[14px] font-medium text-gray-900" />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-orange-500 focus:outline-none">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {type !== "staff" && (
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              </div>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} required
                className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-[14px] font-medium text-gray-900 appearance-none cursor-pointer">
                <option value="" disabled>Select Department</option>
                <option value="manager">Manager</option>
                <option value="accounts/finance">Accounts / Finance</option>
                <option value="backoffice">Back Office</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full mt-2 bg-green-500 text-white py-3.5 rounded-2xl shadow-lg shadow-green-500/30 hover:bg-green-600 hover:shadow-green-500/50 transition-all font-bold text-[15px] tracking-wide disabled:opacity-70">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      )}

      <p className="mt-5 text-center text-[15px] text-gray-600 font-medium pb-2">
        Already have an account?{" "}
        <button type="button" onClick={switchToLogin} className="font-bold text-orange-600 hover:text-orange-500 transition-colors">
          Sign In
        </button>
      </p>
    </form>
  );
};

export default Signup;