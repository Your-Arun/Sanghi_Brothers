import React, { useContext, useState, useEffect } from "react";
import UserContext from "../Home Page/UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProfileModal = ({ user, onClose, onUpdate }) => {
  const { user: currentUser } = useContext(UserContext);
  const isManager = currentUser?.department?.toLowerCase() === "manager";
  const isSelf = currentUser?._id === user._id;

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

  // Aadhaar split
  useEffect(() => {
    if (user.aadhaar) {
      const parts = user.aadhaar.match(/.{1,4}/g) || ["", "", ""];
      setAadhaarParts(parts);
    }
  }, [user.aadhaar]);

  // Attendance fetch
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

  const handleChange = (key, value) => {
    setEditedUser({ ...editedUser, [key]: value });
  };

  const handleAadhaarChange = (index, value) => {
    if (/^\d{0,4}$/.test(value)) {
      const newParts = [...aadhaarParts];
      newParts[index] = value;
      setAadhaarParts(newParts);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditedUser({ ...editedUser, photo: preview, photoFile: file });
    }
  };

  const handleSave = async () => {
    const aadhaar = aadhaarParts.join("");
    if (aadhaar && aadhaar.length !== 12 && isManager) {
      toast.error("Aadhaar must be 12 digits.");
      return;
    }

    const formData = new FormData();
    Object.entries(editedUser).forEach(([key, value]) => {
      if (key !== "photoFile") formData.append(key, value);
    });
    if (isManager) formData.append("aadhaar", aadhaar);
    if (joiningDate && isManager) {
      formData.append("joiningDate", joiningDate.toISOString().split("T")[0]);
    }
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
      console.error(err);
      toast.error("Error updating user.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/users/${user._id}`);
      toast.success("User deleted successfully.");
      onUpdate && onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting user.");
    }
  };

  // ✅ User can edit only his own profile OR manager can edit anyone
  const editableForUser = ["name", "username", "phone", "address", "photo"];
  const canEditField = (key) => {
    if (isManager) return true;
    if (isSelf && editableForUser.includes(key)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999]">
      <div className="bg-gray-900 text-white w-full max-w-3xl p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Close */}
        <div
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl cursor-pointer"
        >
          ❌
        </div>

        {/* Header */}
        <div className="flex items-center gap-6 mb-6 border-b border-gray-700 pb-4">
          <div className="relative">
            <img
              src={editedUser.photo || "/user-avatar.png"}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-700"
            />
            {editMode && canEditField("photo") && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute bottom-0 left-0 text-xs"
              />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.designation}</p>
            <p className="text-blue-400 text-sm font-semibold">
              {user.department}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        {/* same as your code */}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-4">
          {/* Edit/Save visible only if self OR manager */}
          {(isSelf || isManager) &&
            (!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditedUser({ ...user });
                    setAadhaarParts(
                      user.aadhaar?.match(/.{1,4}/g) || ["", "", ""]
                    );
                    setJoiningDate(
                      user.joiningDate ? new Date(user.joiningDate) : null
                    );
                    setEditMode(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ))}

          {/* Delete only if manager */}
          {isManager && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
