import React, { useContext, useState, useEffect } from "react";
import UserContext from "../Home Page/UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProfileModal = ({ user, onClose, onUpdate }) => {
  const { user: currentUser } = useContext(UserContext);
  const isManager = currentUser?.department === "Manager"; // ✅ Manager full access

  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [aadhaarParts, setAadhaarParts] = useState(["", "", ""]);
  const [joiningDate, setJoiningDate] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ Pre-fill Aadhaar + Joining date
  useEffect(() => {
    if (user.aadhaar) {
      setAadhaarParts([
        user.aadhaar.slice(0, 4),
        user.aadhaar.slice(4, 8),
        user.aadhaar.slice(8, 12),
      ]);
    }
    if (user.joiningDate) {
      setJoiningDate(new Date(user.joiningDate));
    }
  }, [user]);

  // ✅ Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Aadhaar parts change
  const handleAadhaarChange = (index, value) => {
    if (/^\d{0,4}$/.test(value)) {
      const updatedParts = [...aadhaarParts];
      updatedParts[index] = value;
      setAadhaarParts(updatedParts);
    }
  };

  // ✅ Photo select
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser((prev) => ({ ...prev, photoFile: file })); // only file for backend
      setPreview(URL.createObjectURL(file)); // only preview for UI
    }
  };

  // ✅ Save handler (Manager or self-user)
  const handleSave = async () => {
    const aadhaar = aadhaarParts.join("");
    if (aadhaar && aadhaar.length !== 12 && isManager) {
      toast.error("Aadhaar must be 12 digits.");
      return;
    }

    const formData = new FormData();

    // ✅ Append normal fields (skip photo + file)
    Object.entries(editedUser).forEach(([key, value]) => {
      if (key !== "photo" && key !== "photoFile") {
        formData.append(key, value);
      }
    });

    if (isManager) formData.append("aadhaar", aadhaar);
    if (joiningDate && isManager) {
      formData.append("joiningDate", joiningDate.toISOString().split("T")[0]);
    }

    // ✅ Append only photoFile if exists
    if (editedUser.photoFile) {
      formData.append("photo", editedUser.photoFile);
    }

    try {
      const res = await axiosInstance.put(`/users/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("User updated successfully.");
      setEditMode(false);
      onUpdate && onUpdate(res.data);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating user.");
    }
  };

  // ✅ Delete handler (Manager can delete anyone, user can delete self)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      await axiosInstance.delete(`/users/${user._id}`);
      toast.success("User deleted successfully.");
      onUpdate && onUpdate(null, user._id); // notify parent
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting user.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-3xl p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          ✕
        </button>

        {/* Photo */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={preview || user.photo || "/default-avatar.png"}
            alt="User"
            className="w-28 h-28 rounded-full border shadow"
          />
          {editMode && (
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          )}
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={editedUser.name || ""}
            onChange={handleChange}
            disabled={!editMode}
            className="border p-2 rounded"
            placeholder="Full Name"
          />
          <input
            name="email"
            value={editedUser.email || ""}
            onChange={handleChange}
            disabled={!editMode}
            className="border p-2 rounded"
            placeholder="Email"
          />
          <input
            name="phone"
            value={editedUser.phone || ""}
            onChange={handleChange}
            disabled={!editMode}
            className="border p-2 rounded"
            placeholder="Phone"
          />

          {/* Aadhaar (Manager only) */}
          {isManager && (
            <div className="flex space-x-2">
              {aadhaarParts.map((part, i) => (
                <input
                  key={i}
                  type="text"
                  value={part}
                  onChange={(e) => handleAadhaarChange(i, e.target.value)}
                  disabled={!editMode}
                  maxLength={4}
                  className="border p-2 w-full rounded text-center"
                />
              ))}
            </div>
          )}

          {/* Joining Date (Manager only) */}
          {isManager && (
            <DatePicker
              selected={joiningDate}
              onChange={(date) => setJoiningDate(date)}
              disabled={!editMode}
              className="border p-2 rounded w-full"
              dateFormat="yyyy-MM-dd"
              placeholderText="Joining Date"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 space-x-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {(isManager || currentUser._id === user._id) && (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              )}
              {(isManager || currentUser._id === user._id) && (
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
