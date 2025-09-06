import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

const CreateUserPage = () => {
  const navigate = useNavigate();

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser((prev) => ({ ...prev, photo: file })); // direct file bhejna
    }
  };
  

  const handleInputChange = (e, key) => {
    let value = e.target.value;

    if (key === "aadhaar") {
      value = value.replace(/\D/g, "").slice(0, 12);
    }

    setNewUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!newUser.name || !newUser.phone || !newUser.email || !newUser.department) {
      toast.error("Please fill in all required fields (Name, Email, Phone, Department)");
      return;
    }
  
    try {
      const formData = new FormData();
      Object.entries(newUser).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
  
      // ✅ Default password = phone
      formData.append("password", newUser.phone);
  
      await axiosInstance.post("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success("User created successfully");
      setTimeout(() => navigate("/attendance-sheet"), 1500);
    } catch (err) {
      console.error("❌ Error creating user:", err);
      toast.error("Something went wrong. Could not create user.");
    }
  };
  

  const formatPlaceholder = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">➕ Create New User</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(newUser).map(([key, val]) => {
            if (key === "photo" || key === "password") return null;

            if (key === "department") {
              return (
                <select
                  key={key}
                  value={val}
                  onChange={(e) => handleInputChange(e, key)}
                  className="col-span-2 border border-gray-600 bg-gray-700 p-2 rounded text-white"
                >
                   <option value="">Select Department</option>
                <option value="manager">MANAGER</option>
                <option value="accounts/finance">ACCOUNTS/FINANCE</option>
                <option value="backoffice">BACK OFFICE</option>
                <option value="staff">STAFF</option>
                </select>
              );
            }

            if (key === "aadhaar") {
              return (
                <input
                  key={key}
                  type="text"
                  placeholder="Aadhaar Number"
                  value={val}
                  onChange={(e) => handleInputChange(e, key)}
                  className="border border-gray-600 bg-gray-700 p-2 rounded text-white placeholder-gray-400"
                />
              );
            }

            if (key === "joiningDate") {
              return (
                <input
                  key={key}
                  type="date"
                  placeholder="Joining Date"
                  value={val}
                  onChange={(e) => setNewUser({ ...newUser, [key]: e.target.value })}
                  className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
                />
              );
            }

            return (
              <input
                key={key}
                type="text"
                placeholder={formatPlaceholder(key)}
                value={val}
                onChange={(e) => handleInputChange(e, key)}
                className="border border-gray-600 bg-gray-700 p-2 rounded text-white placeholder-gray-400"
              />
            );
          })}

          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleFileChange}
            className="col-span-2 border bg-gray-700 text-white rounded p-2"
          />
        </div>

        <button
          onClick={() => navigate("/attendance-sheet")}
          className="mt-4 bg-red-600 w-full py-2 rounded hover:bg-red-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="mt-4 bg-green-600 w-full py-2 rounded hover:bg-green-700"
        >
          Save User
        </button>
      </div>
    </div>
  );
};

export default CreateUserPage;
