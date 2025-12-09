import React, { useContext, useState, useEffect } from "react";
import UserContext from "../Home Page/UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaIdCard, 
  FaCalendarAlt,
  FaCamera,
  FaTimes,
  FaEdit,
  FaSave,
  FaTrash
} from "react-icons/fa";

const ProfileModal = ({ user, onClose, onUpdate }) => {
  const { user: currentUser } = useContext(UserContext);

  const isManager = currentUser?.department?.toLowerCase() === "manager";
  const isSelf = currentUser?._id === user._id;

  // --- STATE ---
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [aadhaarParts, setAadhaarParts] = useState(["", "", ""]);
  const [joiningDate, setJoiningDate] = useState(
    user.joiningDate ? new Date(user.joiningDate) : null
  );
  const [attendanceCounts, setAttendanceCounts] = useState({
    present: 0,
    absent: 0,
    leave: 0,
  });
  const [photoPreview, setPhotoPreview] = useState(user.photo);

  // --- EFFECTS ---
  useEffect(() => {
    if (user.aadhaar) {
      const parts = user.aadhaar.match(/.{1,4}/g) || ["", "", ""];
      setAadhaarParts(parts);
    }
  }, [user.aadhaar]);

  useEffect(() => {
    const fetchMonthlyAttendance = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");

        const res = await axiosInstance.get(
          `/user-attendance/${user._id}?year=${year}&month=${month}`
        );

        const counts = { present: 0, absent: 0, leave: 0 };
        res.data.forEach((entry) => {
          if (entry.status === "Present") counts.present++;
          if (entry.status === "Absent") counts.absent++;
          if (entry.status === "Leave") counts.leave++;
        });

        setAttendanceCounts(counts);
      } catch (err) {
        console.error("Failed to fetch monthly attendance:", err);
      }
    };

    fetchMonthlyAttendance();
  }, [user._id]);

  // --- HANDLERS ---
  const handleChange = (key, value) => {
    setEditedUser({ ...editedUser, [key]: value });
  };

  const handleAadhaarChange = (index, value) => {
    if (/^\d{0,4}$/.test(value)) {
      const newParts = [...aadhaarParts];
      newParts[index] = value;
      setAadhaarParts(newParts);
      // Join parts for saving later
      setEditedUser(prev => ({...prev, aadhaar: newParts.join('')}));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      setEditedUser({ ...editedUser, photoFile: file });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(editedUser).forEach(([key, value]) => {
        if (key !== "photo" && key !== "photoFile" && key !== "attendance") {
             formData.append(key, value);
        }
      });

      if (editedUser.photoFile) formData.append("photo", editedUser.photoFile);
      if (joiningDate) formData.append("joiningDate", joiningDate.toISOString());

      const response = await axiosInstance.put(`/users/${editedUser._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditedUser(response.data);
      toast.success("Profile updated successfully!");
      setEditMode(false);
      if(onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if(window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
        try {
            await axiosInstance.delete(`/users/${user._id}`);
            toast.success("User deleted successfully.");
            onUpdate?.();
            onClose();
        } catch (err) {
            toast.error("Error deleting user.");
        }
    }
  };

  // Permissions
  const editableForUser = ["name", "username", "phone", "address", "photo"];
  const canEditField = (key) => {
    if (isManager) return true;
    if (isSelf && editableForUser.includes(key)) return true;
    return false;
  };

  // Helper for Input
  const ProfileInput = ({ label, icon, value, fieldKey, type = "text" }) => (
    <div className="w-full">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
        <div className="relative">
            <div className="absolute top-2.5 left-3 text-gray-400">{icon}</div>
            {editMode && canEditField(fieldKey) ? (
                <input 
                    type={type} 
                    value={value || ""} 
                    onChange={(e) => handleChange(fieldKey, e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                />
            ) : (
                <div className="w-full pl-10 pr-3 py-2 bg-white border border-transparent text-gray-800 font-medium text-sm truncate">
                    {value || "-"}
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* --- HEADER --- */}
        <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600 shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition p-1 bg-black/20 rounded-full">
                <FaTimes size={18} />
            </button>
        </div>

        {/* --- PROFILE PIC & INFO --- */}
        <div className="px-8 pb-6 relative flex flex-col sm:flex-row items-start sm:items-end -mt-12 gap-4 border-b border-gray-100">
            <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                    <img 
                        src={photoPreview || "/user-avatar.png"} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "/user-avatar.png"; }}
                    />
                </div>
                {editMode && canEditField("photo") && (
                    <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-sm hover:scale-110 transition">
                        <FaCamera size={12} />
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                )}
            </div>
            
            <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{editedUser.name}</h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><FaBriefcase size={12}/> {editedUser.designation || "Employee"}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1"><FaBuilding size={12}/> {editedUser.department || "General"}</span>
                </div>
            </div>

            {/* Edit/Save Actions (Top Right on Desktop) */}
            <div className="absolute top-16 right-6 hidden sm:flex gap-2">
                {(isSelf || isManager) && (
                    !editMode ? (
                        <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 text-sm font-semibold rounded-lg shadow hover:bg-gray-50 transition">
                            <FaEdit /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-white text-gray-600 text-sm font-semibold rounded-lg shadow hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-green-700 transition"><FaSave /> Save</button>
                        </div>
                    )
                )}
            </div>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-gray-50/50">
            
            {/* 1. Basic Info */}
            <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ProfileInput label="Full Name" icon={<FaUser/>} value={editedUser.name} fieldKey="name" />
                    <ProfileInput label="Username" icon={<FaUser/>} value={editedUser.username} fieldKey="username" />
                    <ProfileInput label="Email" icon={<FaEnvelope/>} value={editedUser.email} fieldKey="email" type="email" />
                    <ProfileInput label="Phone" icon={<FaPhone/>} value={editedUser.phone} fieldKey="phone" type="tel" />
                    <div className="sm:col-span-2">
                        <ProfileInput label="Address" icon={<FaMapMarkerAlt/>} value={editedUser.address} fieldKey="address" />
                    </div>
                </div>
            </section>

            {/* 2. Official Info */}
            <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Official Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ProfileInput label="Department" icon={<FaBuilding/>} value={editedUser.department} fieldKey="department" />
                    <ProfileInput label="Designation" icon={<FaBriefcase/>} value={editedUser.designation} fieldKey="designation" />
                    
                    {/* Joining Date */}
                    <div className="w-full">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Joining Date</label>
                        <div className="relative">
                            <div className="absolute top-2.5 left-3 text-gray-400"><FaCalendarAlt/></div>
                            {editMode && isManager ? (
                                <DatePicker
                                    selected={joiningDate}
                                    onChange={(date) => setJoiningDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            ) : (
                                <div className="w-full pl-10 pr-3 py-2 bg-white text-gray-800 font-medium text-sm">
                                    {joiningDate ? joiningDate.toLocaleDateString("en-IN") : "-"}
                                </div>
                            )}
                        </div>
                    </div>

                    <ProfileInput label="Salary" icon={<FaMoneyBillWave/>} value={editedUser.salary} fieldKey="salary" type="number" />
                    
                    {/* Aadhaar */}
                    <div className="w-full sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Aadhaar Number</label>
                        <div className="relative">
                            <div className="absolute top-2.5 left-3 text-gray-400"><FaIdCard/></div>
                            {editMode && isManager ? (
                                <div className="flex gap-2 pl-10">
                                    {aadhaarParts.map((part, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            value={part}
                                            maxLength={4}
                                            onChange={(e) => handleAadhaarChange(i, e.target.value)}
                                            className="w-16 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full pl-10 pr-3 py-2 bg-white text-gray-800 font-medium text-sm">
                                    {user.aadhaar ? String(user.aadhaar).replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3") : "-"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Stats Section */}
            <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex justify-between items-center">
                    <span>Attendance Overview</span>
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
                    </span>
                </h3>
                <div className="flex justify-around text-center">
                    <div>
                        <p className="text-2xl font-bold text-green-600">{attendanceCounts.present}</p>
                        <p className="text-xs text-gray-500 font-medium uppercase mt-1">Present</p>
                    </div>
                    <div className="w-px bg-gray-200 h-10"></div>
                    <div>
                        <p className="text-2xl font-bold text-yellow-500">{attendanceCounts.leave}</p>
                        <p className="text-xs text-gray-500 font-medium uppercase mt-1">Leaves</p>
                    </div>
                    <div className="w-px bg-gray-200 h-10"></div>
                    <div>
                        <p className="text-2xl font-bold text-red-500">{attendanceCounts.absent}</p>
                        <p className="text-xs text-gray-500 font-medium uppercase mt-1">Absent</p>
                    </div>
                </div>
            </section>

            {/* Mobile Actions & Delete */}
            <div className="flex flex-col gap-3 sm:hidden pb-4">
                {(isSelf || isManager) && (
                    !editMode ? (
                        <button onClick={() => setEditMode(true)} className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg shadow">Edit Profile</button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => setEditMode(false)} className="flex-1 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg">Cancel</button>
                            <button onClick={handleSave} className="flex-1 py-2 bg-green-600 text-white font-medium rounded-lg shadow">Save</button>
                        </div>
                    )
                )}
            </div>

            {isManager && (
                <div className="pt-4 border-t border-gray-200 text-right">
                    <button onClick={handleDelete} className="text-red-500 text-sm font-medium hover:text-red-700 hover:underline flex items-center gap-1 justify-end w-full sm:w-auto ml-auto">
                        <FaTrash size={12}/> Delete User Account
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;