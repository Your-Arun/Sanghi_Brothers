import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../Home Page/UserContext";

const ProfileModal = ({ closeModal }) => {
  const { user, setUser, handleLogout } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false); // Track if name is changed

  // Track changes in username
  useEffect(() => {
    setIsChanged(username !== user?.username);
  }, [username, user]);

  // Handle profile update
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!isChanged) return; // Prevent unnecessary API calls

    setLoading(true);
    try {
      const { data } = await axiosInstance.put("/profile", { username });
      setUser(data.user);
      sessionStorage.setItem("activeSession", JSON.stringify(data.user)); // ✅ Save updated user session
      toast.success("Profile updated successfully!");
      closeModal();
    } catch (err) {
      console.error("❌ Profile Update Error:", err);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md relative">
        <button className="absolute top-4 right-4 text-gray-500" onClick={closeModal}>
          ❌
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Edit Profile</h2>

        <form onSubmit={handleProfileSave}>
          {/* Editable Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Name:</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Non-Editable Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email:</label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100">{user.email}</p>
          </div>

          {/* Non-Editable Role */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Role:</label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100">{user.department}</p>
          </div>

          <div className="flex justify-between">
            <button type="button" className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={handleLogout}>
              Logout
            </button>
            <div>
              <button type="button" className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg ${
                  isChanged ? "bg-blue-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
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
