import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import UserContext from "../Home Page/UserContext";
import { FaCamera, FaTimes } from "react-icons/fa"; // Inputs ke icons hata diye gaye hain

// ✅ Clean Input Field (Bina Icon Ke)
const InputField = ({ label, value, onChange, type = "text", disabled = false }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        w-full px-5 py-4 
        text-[15px] font-medium rounded-2xl border outline-none transition-all duration-200
        ${disabled 
          ? "bg-gray-100/80 border-transparent text-gray-500 cursor-not-allowed" 
          : "bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 hover:border-blue-300"
        }
      `}
    />
  </div>
);

const ProfileModal = ({ closeModal }) => {
  const navigate = useNavigate();
  const { user, setUser, handleLogout } = useContext(UserContext);

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.photo || "");
  const [loading, setLoading] = useState(false);
  const[isChanged, setIsChanged] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Background Scroll Lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  },[]);

  // Track changes to enable/disable Save button
  useEffect(() => {
    setIsChanged(
      name !== user?.name ||
      username !== user?.username ||
      phone !== user?.phone ||
      photo !== null
    );
  }, [name, username, phone, photo, user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Smooth closing animation
  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(closeModal, 300);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!isChanged) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("phone", phone);
      if (photo) formData.append("photo", photo);

      const { data } = await axiosInstance.put(`/users/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(data.user);
      sessionStorage.setItem("activeSession", JSON.stringify(data.user));
      toast.success("Profile updated successfully!");
      handleClose();
    } catch (err) {
      console.error("Profile Update Error:", err);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center">
      
      {/* Dark Blur Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
        onClick={handleClose}
      />

      {/* Profile Card Container (Bottom Sheet on Mobile, Centered on Desktop) */}
      <div 
        className={`relative w-full sm:w-[440px] bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out transform ${
          isAnimating ? "translate-y-full opacity-0 sm:scale-95" : "translate-y-0 opacity-100 sm:scale-100"
        }`}
        style={{ maxHeight: '92vh' }}
      >
        
        {/* --- Header Banner --- */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative shrink-0">
          {/* Mobile Drag Handle */}
          <div className="w-full flex justify-center pt-4 sm:hidden" onClick={handleClose}>
            <div className="w-14 h-1.5 bg-white/30 rounded-full cursor-pointer" />
          </div>
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2.5 rounded-full transition-all backdrop-blur-md"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* --- Profile Photo Section --- */}
        <div className="flex flex-col items-center -mt-16 px-6 shrink-0 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-[5px] border-white shadow-xl overflow-hidden bg-gray-100">
              <img
                src={preview || "/user.png"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/user.png"; }}
              />
            </div>
            {/* Camera Upload Button */}
            <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg border-[3px] border-white transition-transform active:scale-95">
              <FaCamera size={14} />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
          
          <div className="text-center mt-3 mb-2">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{user.name}</h2>
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mt-1.5 border border-blue-100">
              {user.department || "User"}
            </span>
          </div>
        </div>

        {/* --- Scrollable Form Section --- */}
        <div className="px-6 pb-6 pt-2 overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <InputField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <InputField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <InputField label="Phone Number" value={phone} type="tel" onChange={(e) => setPhone(e.target.value)} />
            <InputField label="Email Address" value={user.email} disabled={true} />
          </form>

          {/* Admin Panel Access Button */}
          {user.department === "manager" && (
            <button
              onClick={() => {
                handleClose();
                setTimeout(() => navigate("/admin-panel"), 300);
              }}
              type="button"
              className="w-full mt-6 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-all text-[15px] tracking-wide"
            >
              Access Admin Panel
            </button>
          )}
        </div>

        {/* --- Footer Buttons --- */}
        <div className="p-5 border-t border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleProfileSave}
            disabled={!isChanged || loading}
            className={`w-full sm:w-auto sm:flex-1 py-4 rounded-2xl font-bold text-[15px] tracking-wide transition-all ${
              isChanged 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98]" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                handleClose();
                setTimeout(handleLogout, 300);
              }}
              className="flex-1 sm:w-auto py-4 px-6 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all text-[15px] active:scale-[0.98]"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 sm:hidden py-4 px-6 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all text-[15px] active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;