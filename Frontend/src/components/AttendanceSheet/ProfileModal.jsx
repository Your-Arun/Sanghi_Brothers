import React, { useContext, useState } from "react";
import { UserContext } from "../Home Page/UserContext"; // Make sure path is correct
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";



const ProfileModal = ({ user, onClose, onUpdate }) => {
  const { currentUser } = useContext(UserContext); // Access logged-in user
  const isManager = currentUser?.department?.toLowerCase() === "manager";

  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (key, value) => {
    // Allow only numeric values for these fields
    if (["salary", "aadhaar"].includes(key) && value && !/^\d*$/.test(value)) return;
    if (key === "joiningDate" && value && !/^\d{0,4}-?\d{0,2}-?\d{0,2}$/.test(value)) return;

    setEditedUser({ ...editedUser, [key]: value });
  };

  const handleSave = async () => {
    try {
      const res = await axiosInstance.put(`/users/${user._id}`, editedUser); // Adjust API path as needed
      toast.success("User updated successfully.");
      setEditMode(false);
      onUpdate && onUpdate(res.data); // Notify parent of changes
    } catch (err) {
      console.error(err);
      toast.error("Error updating user.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white w-full max-w-3xl p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl text-red-400 hover:text-red-600"
        >
          &times;
        </button>

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
            ["Joining Date", "joiningDate"],
            ["Aadhaar", "aadhaar"],
          ].map(([label, key]) => (
            <div key={key}>
              <p className="text-sm font-medium text-gray-400">{label}</p>
              {editMode ? (
                <input
                  type={["salary", "aadhaar"].includes(key) ? "number" : "text"}
                  value={editedUser[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-200">{user[key] || "-"}</p>
              )}
            </div>
          ))}

          <div>
            <p className="text-sm font-medium text-gray-400">Attendance</p>
            <p className="mt-1 text-gray-200">{user.attendance?.length || 0}</p>
          </div>
        </div>

        {isManager && (
          <div className="mt-6 flex justify-end gap-4">
            {!editMode ? (
              <div
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
              >
                Edit
              </div>
            ) : (
              <>
                <div
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
                >
                  Save
                </div>
                <div
                  onClick={() => {
                    setEditedUser({ ...user });
                    setEditMode(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded"
                >
                  Cancel
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
