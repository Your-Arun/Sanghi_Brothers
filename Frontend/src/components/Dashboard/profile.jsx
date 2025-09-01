import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import UserContext from "../Home Page/UserContext";

const ProfileModal = ({ closeModal }) => {
  const navigate = useNavigate();
  const { user, setUser, handleLogout } = useContext(UserContext);

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsChanged(
      name !== user?.name ||
      username !== user?.username ||
      phone !== user?.phone
    );
  }, [name, username, phone, user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!isChanged) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.put("/profile", {
        name,
        username,
        phone,
      });

      setUser(data.user);
      sessionStorage.setItem("activeSession", JSON.stringify(data.user));
      toast.success("Profile updated successfully!");
      closeModal();
    } catch (err) {
      console.error("Profile Update Error:", err);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
      <div className="bg-white p-6 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md max-h-[95vh] relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 text-xl bg-transparent"
          onClick={closeModal}
          aria-label="Close"
        >
          ❌
        </button>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-center text-blue-600">
          Edit Profile
        </h2>

        {/* Form */}
        <form onSubmit={handleProfileSave} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>

          {/* Email - Read-only */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email:</label>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm">
              {user.email}
            </p>
          </div>

          {/* Department - Read-only */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role:</label>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm">
              {user.department || "N/A"}
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>

          {/* Admin Panel Shortcut */}
          {user.department === "manager" && (
            <div className="text-center">
              <button
                onClick={() => navigate("/admin-panel")}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
              >
                Go to Admin Panel
              </button>
            </div>
          )}

          {/* Bottom Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
            <div className="flex gap-2 justify-end w-full sm:w-auto">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-black rounded-md text-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-sm rounded-md ${
                  isChanged
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
                disabled={!isChanged || loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
