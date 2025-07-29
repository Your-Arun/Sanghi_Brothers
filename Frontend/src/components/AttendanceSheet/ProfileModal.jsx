import React, { useContext, useState, useEffect } from "react";
import  UserContext  from "../Home Page/UserContext";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProfileModal = ({ user, onClose, onUpdate }) => {
  const { user: currentUser } = useContext(UserContext);
  const isManager = currentUser?.department?.toLowerCase() === "manager";

  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  // Aadhaar split into 3 parts
  const [aadhaarParts, setAadhaarParts] = useState(["", "", ""]);

  // Date picker state
  const [joiningDate, setJoiningDate] = useState(
    user.joiningDate ? new Date(user.joiningDate) : null
  );

  useEffect(() => {
    if (user.aadhaar) {
      const parts = user.aadhaar.match(/.{1,4}/g) || ["", "", ""];
      setAadhaarParts(parts);
    }
  }, [user.aadhaar]);

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
      joiningDate: joiningDate?.toISOString().split("T")[0], // Format as yyyy-mm-dd
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white w-full max-w-3xl p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
        <div
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl text-red-400 hover:text-red-600 cursor-pointer"
        >
          &times;
        </div>

        <div className="flex items-center gap-6 mb-6">
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

        <div className="grid grid-cols-2 gap-4">
          {[
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

          {/* Joining Date Picker */}
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
              <p className="mt-1 text-gray-200">{user.joiningDate || "-"}</p>
            )}
          </div>

          {/* Aadhaar with 3 input boxes */}
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
              <p className="mt-1 text-gray-200">{user.aadhaar || "-"}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-400">Attendance</p>
            <p className="mt-1 text-gray-200">{user.attendance?.length || 0}</p>
          </div>
        </div>

        {isManager && (
          <div className="mt-6 flex justify-end gap-4">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700  text-white px-5 py-2 rounded"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
