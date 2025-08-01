// src/pages/CreateUserPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Dashboard/axiosInstance";

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "", // will default to phone later
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
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, and PNG allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewUser({ ...newUser, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e, key) => {
    let value = e.target.value;

    if (key === "aadhaar") {
      value = value.replace(/\D/g, "").slice(0, 12);
    }

    setNewUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const userToSave = {
        ...newUser,
        password: newUser.phone, // ✅ Set default password as phone
      };

      await axiosInstance.post("/users", userToSave);
      alert("✅ User created successfully");
      navigate("/attendance");
    } catch (err) {
      console.error("❌ Error creating user:", err);
      alert("Error: " + err.message || "Failed to create user");
    }
  };

  const formatPlaceholder = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">➕ Create New User</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(newUser).map(([key, val]) => {
            if (key === "photo") return null;

            if (key === "aadhaar") {
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
            }

            if (key === "joiningDate") {
              return (
                <input
                  key={key}
                  type="date"
                  placeholder="Joining Date"
                  value={val}
                  onChange={(e) => setNewUser({ ...newUser, [key]: e.target.value })}
                  className="border border-gray-600 bg-gray-700 p-2 rounded text-white placeholder-gray-400"
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
