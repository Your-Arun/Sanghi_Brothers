import React, { useContext, useState, useEffect } from "react";
import UserContext from "../Home Page/UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProfileModal = ({ user, onClose, onUpdate }) => {
  const { user: currentUser } = useContext(UserContext);
  const isManager = currentUser?.department?.toLowerCase() === "manager";

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

  const handleSave = async () => {
    const aadhaar = aadhaarParts.join("");
    if (aadhaar.length !== 12) {
      toast.error("Aadhaar must be 12 digits.");
      return;
    }

    const updatedUser = {
      ...editedUser,
      aadhaar,
      joiningDate: joiningDate?.toISOString().split("T")[0],
    };

    try {
      const res = await axiosInstance.put(`/users/${user._id}`, updatedUser);
      toast.success("User updated successfully.");
      setEditMode(false);
      onUpdate && onUpdate(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error updating user.");
    }
  };

  const confirmDeleteToast = (onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this user?</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => {
                closeToast();
                onConfirm();
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  const handleDelete = async () => {
    confirmDeleteToast(async () => {
      try {
        await axiosInstance.delete(`/users/${user._id}`);
        onClose();
        if (onUpdate) onUpdate();
        toast.success("User deleted successfully.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete user.");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999]">
      <div className="bg-gray-900 text-white w-full max-w-3xl p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl"
        >
          ✖
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-6 border-b border-gray-700 pb-4">
          <img
            src={user.photo || ""}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-700"
          />
          <div>
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.designation}</p>
            <p className="text-blue-400 text-sm font-semibold">{user.department}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            ["Name", "name"],
            ["Username", "username"],
            ["Email", "email"],
            ["Phone", "phone"],
            ["Address", "address"],
            ["Salary", "salary"],
          ].map(([label, key]) => (
            <div key={key}>
              <p className="text-sm font-medium text-gray-400">{label}</p>
              {editMode ? (
                <input
                  type={key === "salary" ? "number" : "text"}
                  value={editedUser[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-200">{user[key] || "-"}</p>
              )}
            </div>
          ))}

          {/* Joining Date */}
          <div>
            <p className="text-sm font-medium text-gray-400">Joining Date</p>
            {editMode ? (
              <DatePicker
                selected={joiningDate}
                onChange={(date) => setJoiningDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                className="w-full mt-1 px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded"
              />
            ) : (
              <p className="mt-1 text-gray-200">
                {user.joiningDate
                  ? new Date(user.joiningDate).toLocaleDateString("en-IN")
                  : "-"}
              </p>
            )}
          </div>

          {/* Aadhaar */}
          <div>
            <p className="text-sm font-medium text-gray-400">Aadhaar</p>
            {editMode ? (
              <div className="flex gap-2 mt-1">
                {aadhaarParts.map((part, i) => (
                  <input
                    key={i}
                    type="text"
                    value={part}
                    maxLength={4}
                    onChange={(e) => handleAadhaarChange(i, e.target.value)}
                    className="w-1/3 px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded text-center"
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

          {/* Attendance Counts */}
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-400">
              Attendance ({new Date().toLocaleString("default", { month: "long", year: "numeric" })})
            </p>
            <p className="mt-1 text-gray-200">
              ✅ Present: {attendanceCounts.present} | ❌ Absent: {attendanceCounts.absent} | 🟡 Leave: {attendanceCounts.leave}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {isManager && (
          <div className="mt-6 flex justify-end gap-4">
            {!editMode ? (
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
                    setAadhaarParts(user.aadhaar?.match(/.{1,4}/g) || ["", "", ""]);
                    setJoiningDate(user.joiningDate ? new Date(user.joiningDate) : null);
                    setEditMode(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
