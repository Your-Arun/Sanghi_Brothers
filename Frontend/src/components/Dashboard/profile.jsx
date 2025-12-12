import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import UserContext from "../Home Page/UserContext";
import { 
  FaCamera, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaBriefcase, 
  FaUserShield, 
  FaSignOutAlt, 
  FaTimes 
} from "react-icons/fa";

// --- REUSABLE INPUT COMPONENT FOR PERFECT ALIGNMENT ---
const InputField = ({ label, icon: Icon, value, onChange, type = "text", disabled = false }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative group">
      {/* Icon Wrapper: Perfectly Centered */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className={`text-sm transition-colors ${disabled ? "text-gray-400" : "text-gray-400 group-focus-within:text-blue-600"}`} />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full pl-10 pr-4 py-2.5 
          text-sm font-medium rounded-xl border outline-none transition-all duration-200
          ${disabled 
            ? "bg-gray-100 border-transparent text-gray-500 cursor-not-allowed" 
            : "bg-gray-50 border-gray-200 text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          }
        `}
      />
    </div>
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* --- Header Background --- */}
        <div className="h-28 bg-gradient-to-br from-blue-600 to-indigo-700 relative shrink-0">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all backdrop-blur-md"
            >
              <FaTimes />
            </button>
        </div>

        {/* --- Profile Photo Section --- */}
        <div className="flex flex-col items-center -mt-14 px-6 shrink-0 relative z-10">
            <div className="relative group">
                <div className="w-28 h-28 rounded-full border-[5px] border-white shadow-lg overflow-hidden bg-gray-100">
                    <img
                        src={preview || "/user.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "/user.png"; }}
                    />
                </div>
                <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-blue-700 shadow-md border-2 border-white transition transform active:scale-95 group-hover:scale-110">
                    <FaCamera size={14} />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <div className="text-center mt-3">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mt-1">
                    <FaUserShield size={10} /> {user.department || "User"}
                </span>
            </div>
        </div>

        {/* --- Scrollable Form Section --- */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            <form onSubmit={handleProfileSave} className="space-y-5">
                
                <InputField 
                    label="Full Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />

                <InputField 
                    label="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />

                <InputField 
                    label="Phone Number" 
                    icon={FaPhone} 
                    value={phone} 
                    type="tel"
                    onChange={(e) => setPhone(e.target.value)} 
                />

                <div className="grid grid-cols-1 gap-5 pt-2">
                    <InputField 
                        label="Email Address" 
                        value={user.email} 
                        disabled={true} 
                    />
                </div>

                {/* Admin Panel Link */}
                {user.department === "manager" && (
                    <button
                        onClick={() => navigate("/admin-panel")}
                        type="button"
                        className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                        <FaUserShield /> Access Admin Panel
                    </button>
                )}
            </form>
        </div>

        {/* --- Sticky Footer --- */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
            <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-semibold hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition text-sm"
            >
                <FaSignOutAlt /> Logout
            </button>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handleProfileSave}
                    disabled={!isChanged || loading}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all transform active:scale-95 ${
                        isChanged 
                        ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    }`}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;