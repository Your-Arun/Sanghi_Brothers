import React, { useState } from "react";

const ProfileModal = ({ user, onClose }) => {
  const isManager = user?.department?.toLowerCase() === "manager";
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleSave = () => {
    // ✨ Save changes to backend
    alert("Changes saved (implement save logic)");
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-xl text-red-500 hover:text-red-700">&times;</button>
        <div className="flex gap-6 mb-4">
          <img src={user.photo || ""} alt={user.name} className="w-28 h-28 rounded-full object-cover" />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.department}</p>
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
              <p className="text-sm font-semibold">{label}:</p>
              {editMode ? (
                <input
                  type="text"
                  value={editedUser[key]}
                  onChange={(e) => setEditedUser({ ...editedUser, [key]: e.target.value })}
                  className="w-full border px-2 py-1 rounded"
                />
              ) : (
                <p>{user[key]}</p>
              )}
            </div>
          ))}
          <div>
            <p className="text-sm font-semibold">Attendance:</p>
            <p>{user.attendance?.length || 0}</p>
          </div>
        </div>

        {isManager && (
          <div className="mt-4 flex gap-3 justify-end">
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
                Edit
              </button>
            ) : (
              <>
                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
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
