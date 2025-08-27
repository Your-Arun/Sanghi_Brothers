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

  // Field change
  const handleChange = (key, value) => {
    setEditedUser({ ...editedUser, [key]: value });
  };

  // Aadhaar change
  const handleAadhaarChange = (index, value) => {
    if (/^\d{0,4}$/.test(value)) {
      const newParts = [...aadhaarParts];
      newParts[index] = value;
      setAadhaarParts(newParts);
    }
  };

  // Photo select
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file); // temporary preview
      setEditedUser({ ...editedUser, photo: preview, photoFile: file });
    }
  };

  // Save updated user
  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(editedUser).forEach(([key, value]) => {
        if (key !== "photo" && key !== "photoFile") formData.append(key, value);
      });

      if (editedUser.photoFile) formData.append("photo", editedUser.photoFile);

      const response = await axiosInstance.put(
        `/users/${editedUser._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedUser = response.data;

      // ✅ Set updated user with backend photo URL
      setEditedUser({ ...updatedUser, photoFile: null });

      // Notify parent & toast
      onUpdate?.(updatedUser);
      toast.success("Profile updated successfully!");
      setEditMode(false);

      console.log("✅ Photo saved & shown:", updatedUser.photo);
    } catch (err) {
      toast.error("Failed to update profile");
      console.error("❌ Save Failed:", err.response?.data || err);
    }
  };


  // Delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/users/${user._id}`);
      toast.success("User deleted successfully.");
      onUpdate?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting user.");
    }
  };

  // Editable fields for self
  const editableForUser = ["name", "username", "phone", "address", "photo"];
  const canEditField = (key) => {
    if (isManager) return true;
    if (isSelf && editableForUser.includes(key)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999]">
      <div className="bg-gray-900 text-white w-full max-w-2xl p-4 rounded-lg shadow-xl relative max-h-[80vh] overflow-y-auto border border-gray-700">
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
              src={editedUser.photo || "/user-avatar.png"} // backend URL ya default
              alt={editedUser.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
            />
            {editMode && canEditField("photo") && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute bottom-0 left-0 bg-black/70 text-xs text-white"
              />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{editedUser.name}</h2>
            <p className="text-gray-400 text-sm">{editedUser.designation}</p>
            <p className="text-blue-400 text-sm font-semibold">
              {editedUser.department}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            ["Name", "name"],
            ["Username", "username"],
            ["Email", "email"],
            ["Phone", "phone"],
            ["Department", "department"],
            ["Designation", "designation"],
            ["Address", "address"],
            ["Salary", "salary"],
          ].map(([label, key]) => (
            <div key={key}>
              <p className="font-medium text-gray-400">{label}</p>
              {editMode && canEditField(key) ? (
                <input
                  type={key === "salary" ? "number" : "text"}
                  value={editedUser[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-gray-800 text-white border border-gray-700 rounded"
                />
              ) : (
                <p className="mt-1 text-gray-200">{editedUser[key] || "-"}</p>
              )}
            </div>
          ))}

          {/* Joining Date */}
          {isManager && (
            <div>
              <p className="font-medium text-gray-400">Joining Date</p>
              {editMode ? (
                <DatePicker
                  selected={joiningDate}
                  onChange={(date) => setJoiningDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full mt-1 px-2 py-1 bg-gray-800 text-white border border-gray-700 rounded"
                />
              ) : (
                <p className="mt-1 text-gray-200">
                  {user.joiningDate
                    ? new Date(user.joiningDate).toLocaleDateString("en-IN")
                    : "-"}
                </p>
              )}
            </div>
          )}

          {/* Aadhaar */}
          {isManager && (
            <div>
              <p className="font-medium text-gray-400">Aadhaar</p>
              {editMode ? (
                <div className="flex gap-2 mt-1">
                  {aadhaarParts.map((part, i) => (
                    <input
                      key={i}
                      type="text"
                      value={part}
                      maxLength={4}
                      onChange={(e) => handleAadhaarChange(i, e.target.value)}
                      className="w-1/3 px-2 py-1 bg-gray-800 text-white border border-gray-700 rounded text-center"
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-gray-200">
                  {user.aadhaar && String(user.aadhaar).length === 12
                    ? String(user.aadhaar).replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3")
                    : user.aadhaar || "-"}
                </p>
              )}
            </div>
          )}

          {/* Attendance */}
          <div className="col-span-2">
            <p className="font-medium text-gray-400">
              Attendance (
              {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
              )
            </p>
            <p className="mt-1 text-gray-200">
              ✅ Present: {attendanceCounts.present} | ❌ Absent: {attendanceCounts.absent} | 🟡 Leave: {attendanceCounts.leave}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-3 text-sm">
          {(isSelf || isManager) &&
            (!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditedUser({ ...user });
                    setAadhaarParts(user.aadhaar?.match(/.{1,4}/g) || ["", "", ""]);
                    setJoiningDate(user.joiningDate ? new Date(user.joiningDate) : null);
                    setEditMode(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ))}

          {isManager && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
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
