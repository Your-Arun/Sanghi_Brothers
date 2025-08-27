import React, { useContext, useState, useEffect } from "react";
import UserContext from "../Home Page/UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ✅ helper function to convert file → base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const ProfileModal = ({ user, onClose, onUpdate }) => {
  const { user: currentUser } = useContext(UserContext);
  const isManager = currentUser?.department === "Manager"; // ✅ Manager check

  const [editedUser, setEditedUser] = useState(user);
  const [aadhaarParts, setAadhaarParts] = useState(["", "", "", ""]);
  const [joiningDate, setJoiningDate] = useState(null);

  // ✅ load aadhaar + date when modal opens
  useEffect(() => {
    if (user?.aadhaar) {
      const parts = user.aadhaar.match(/.{1,4}/g) || ["", "", "", ""];
      setAadhaarParts(parts);
    }
    if (user?.joiningDate) {
      setJoiningDate(new Date(user.joiningDate));
    }
  }, [user]);

  // ✅ input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  // ✅ Aadhaar parts
  const handleAadhaarChange = (index, value) => {
    const updatedParts = [...aadhaarParts];
    updatedParts[index] = value;
    setAadhaarParts(updatedParts);
  };

  // ✅ Photo upload (convert to base64)
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setEditedUser({ ...editedUser, photo: base64 });
    }
  };

  // ✅ Save profile
  const handleSave = async () => {
    try {
      const payload = {
        ...editedUser,
        aadhaar: aadhaarParts.join(""),
        joiningDate: joiningDate ? joiningDate.toISOString() : null,
      };

      const response = await axiosInstance.put(`/users/${editedUser._id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Profile updated successfully!");
      onUpdate(response.data);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile");
    }
  };

  // ✅ Delete profile (Manager only)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/users/${editedUser._id}`);
      toast.success("User deleted successfully!");
      onUpdate(null);
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        <h2 className="text-2xl font-semibold mb-4 text-center">Profile</h2>

        {/* Photo */}
        <div className="flex justify-center mb-4">
          <label className="cursor-pointer">
            <img
              src={editedUser.photo || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full border object-cover"
            />
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={editedUser.name || ""} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
          <input name="username" value={editedUser.username || ""} onChange={handleChange} placeholder="Username" className="border p-2 rounded" />
          <input name="email" value={editedUser.email || ""} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
          <input name="phone" value={editedUser.phone || ""} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
          <input name="department" value={editedUser.department || ""} onChange={handleChange} placeholder="Department" className="border p-2 rounded" />
          <input name="designation" value={editedUser.designation || ""} onChange={handleChange} placeholder="Designation" className="border p-2 rounded" />
          <input name="salary" type="number" value={editedUser.salary || ""} onChange={handleChange} placeholder="Salary" className="border p-2 rounded" />
          <input name="address" value={editedUser.address || ""} onChange={handleChange} placeholder="Address" className="border p-2 rounded col-span-2" />

          {/* Aadhaar */}
          <div className="col-span-2 flex space-x-2">
            {aadhaarParts.map((part, index) => (
              <input
                key={index}
                maxLength={4}
                value={part}
                onChange={(e) => handleAadhaarChange(index, e.target.value)}
                className="border p-2 rounded w-1/4 text-center"
              />
            ))}
          </div>

          {/* Joining Date */}
          <div className="col-span-2">
            <DatePicker
              selected={joiningDate}
              onChange={(date) => setJoiningDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Joining Date"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
          {isManager && (
            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
          )}
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
