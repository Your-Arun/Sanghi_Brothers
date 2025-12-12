import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import UserContext from "../Home Page/UserContext";
import { FaCamera, FaUser, FaPhone, FaEnvelope, FaBriefcase, FaUserShield, FaSignOutAlt } from "react-icons/fa";

const ProfileModal = ({ closeModal }) => {
  const navigate = useNavigate();
  const { user, setUser, handleLogout } = useContext(UserContext);

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.photo || "");
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

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
      closeModal();
    } catch (err) {
      console.error("Profile Update Error:", err);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* --- Header Background --- */}
        <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-1 rounded-full transition"
            >
              ✕
            </button>
        </div>

        {/* --- Profile Photo Section --- */}
        <div className="flex flex-col items-center -mt-12 px-6">
            <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                    <img
                        src={preview || "/user.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition transform group-hover:scale-110">
                    <FaCamera size={14} />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-3">{user.name}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
                <FaUserShield className="text-blue-500" /> {user.department || "User"}
            </p>
        </div>

        {/* --- Form Section --- */}
        <form onSubmit={handleProfileSave} className="p-6 space-y-4">
            
            {/* Name */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
                <div className="relative">
                    <FaUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-medium text-gray-800"
                    />
                </div>
            </div>

            {/* Username */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Username</label>
                <div className="relative">
                    <FaBriefcase className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-medium text-gray-800"
                    />
                </div>
            </div>

            {/* Phone */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
                <div className="relative">
                    <FaPhone className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-medium text-gray-800"
                    />
                </div>
            </div>

            {/* Read-Only Info */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Role</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 border border-transparent cursor-not-allowed">
                        <FaUserShield /> {user.department || "N/A"}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Email</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 border border-transparent cursor-not-allowed overflow-hidden">
                        <FaEnvelope /> <span className="truncate">{user.email}</span>
                    </div>
                </div>
            </div>

            {/* Admin Panel Link */}
            {user.department === "manager" && (
                <button
                    onClick={() => navigate("/admin-panel")}
                    type="button"
                    className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition transform"
                >
                    Go to Admin Panel
                </button>
            )}

            {/* --- Footer Actions --- */}
            <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-2">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 font-semibold hover:text-red-700 transition text-sm"
                >
                    <FaSignOutAlt /> Logout
                </button>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!isChanged || loading}
                        className={`px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-all ${
                            isChanged 
                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileModal;