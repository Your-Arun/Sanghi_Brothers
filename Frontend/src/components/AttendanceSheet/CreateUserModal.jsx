import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaIdCard, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaCamera, 
  FaArrowLeft, 
  FaSave,
  FaBriefcase,
  FaUserTag
} from "react-icons/fa";

// ✅ FIX: Moved InputGroup OUTSIDE the main component
const InputGroup = ({ label, name, value, onChange, type = "text", icon, placeholder, required }) => (
  <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
          </div>
          <input
              type={type}
              name={name}
              value={value} // ✅ Passed via props
              onChange={onChange} // ✅ Passed via props
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
          />
      </div>
  </div>
);

const CreateUserPage = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "", 
    department: "",
    address: "",
    aadhaar: "",
    designation: "",
    joiningDate: "",
    salary: "",
    photo: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file)); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "aadhaar") {
      finalValue = value.replace(/\D/g, "").slice(0, 12);
    }

    setNewUser((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSave = async () => {
    if (!newUser.name || !newUser.phone || !newUser.email || !newUser.department) {
      toast.error("Please fill in required fields: Name, Email, Phone, Department");
      return;
    }
  
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(newUser).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
  
      // Default password = phone number
      formData.append("password", newUser.phone);
  
      await axiosInstance.post("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success("User created successfully! 🎉");
      setTimeout(() => navigate("/attendance-sheet"), 1500);
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error(err.response?.data?.message || "Could not create user.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => navigate("/attendance-sheet")}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
            >
                <FaArrowLeft />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Add New User</h1>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => navigate("/attendance-sheet")}
                className="hidden sm:block px-4 py-2 text-gray-600 font-medium hover:text-gray-800 transition"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                disabled={loading}
                className={`flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {loading ? "Saving..." : <><FaSave /> Save User</>}
            </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            
            {/* --- PHOTO UPLOAD SECTION --- */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <FaUser className="text-4xl text-gray-300" />
                        )}
                    </div>
                    <label 
                        htmlFor="photo-upload" 
                        className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full shadow-md cursor-pointer hover:bg-indigo-700 transition transform group-hover:scale-110"
                    >
                        <FaCamera size={16} />
                    </label>
                    <input 
                        id="photo-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                    />
                </div>
                <p className="mt-3 text-sm text-gray-500 font-medium">Upload Profile Photo</p>
            </div>

            {/* --- FORM SECTIONS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 1. Personal Details */}
                <div className="space-y-5">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Personal Details</h3>
                    
                    <InputGroup 
                        label="Full Name" 
                        name="name" 
                        value={newUser.name}
                        onChange={handleInputChange}
                        icon={<FaUser />} 
                        placeholder="e.g. John Doe" 
                        required 
                    />
                    
                    <InputGroup 
                        label="Username" 
                        name="username" 
                        value={newUser.username}
                        onChange={handleInputChange}
                        icon={<FaUserTag />} 
                        placeholder="e.g. john.doe" 
                    />

                    <InputGroup 
                        label="Email Address" 
                        name="email" 
                        value={newUser.email}
                        onChange={handleInputChange}
                        type="email" 
                        icon={<FaEnvelope />} 
                        placeholder="e.g. john@company.com" 
                        required 
                    />

                    <InputGroup 
                        label="Phone Number" 
                        name="phone" 
                        value={newUser.phone}
                        onChange={handleInputChange}
                        type="tel" 
                        icon={<FaPhone />} 
                        placeholder="e.g. 9876543210" 
                        required 
                    />
                </div>

                {/* 2. Employment Details */}
                <div className="space-y-5">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Employment Details</h3>

                    {/* Department Select */}
                    <div className="w-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Department <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaBuilding />
                            </div>
                            <select
                                name="department"
                                value={newUser.department}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                            >
                                <option value="">Select Department</option>
                                <option value="manager">Manager</option>
                                <option value="accounts/finance">Accounts/Finance</option>
                                <option value="backoffice">Back Office</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                    </div>

                    <InputGroup 
                        label="Designation" 
                        name="designation" 
                        value={newUser.designation}
                        onChange={handleInputChange}
                        icon={<FaBriefcase />} 
                        placeholder="e.g. Senior Accountant" 
                    />

                    <InputGroup 
                        label="Joining Date" 
                        name="joiningDate" 
                        value={newUser.joiningDate}
                        onChange={handleInputChange}
                        type="date" 
                        icon={<FaCalendarAlt />} 
                    />

                    <InputGroup 
                        label="Salary ( Monthly )" 
                        name="salary" 
                        value={newUser.salary}
                        onChange={handleInputChange}
                        type="number"
                        icon={<FaMoneyBillWave />} 
                        placeholder="e.g. 25000" 
                    />
                </div>

                {/* 3. Additional Info */}
                <div className="md:col-span-2 space-y-5 pt-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Additional Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputGroup 
                            label="Aadhaar Number" 
                            name="aadhaar" 
                            value={newUser.aadhaar}
                            onChange={handleInputChange}
                            icon={<FaIdCard />} 
                            placeholder="12-digit Aadhaar number" 
                        />

                        <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Permanent Address</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 text-gray-400">
                                    <FaMapMarkerAlt />
                                </div>
                                <textarea
                                    name="address"
                                    value={newUser.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter full address"
                                    rows="2"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;