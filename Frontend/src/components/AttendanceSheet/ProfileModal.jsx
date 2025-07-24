import React from "react";

const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-2xl rounded-lg p-6 overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-xl font-bold">
          &times;
        </button>
        <div className="flex items-center gap-6 mb-4">
          <img
            src={user.photo || ""}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.department}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Salary:</strong> ₹{user.salary}</p>
          <p><strong>Date of Joining:</strong> {user.joiningDate}</p>
          <p><strong>Aadhaar No:</strong> {user.aadhaar}</p>
          <p><strong>Attendance Count:</strong> {user.attendanceCount || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
