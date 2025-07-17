import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import UserContext from "../Home Page/UserContext";

const ProfileModal = ({ closeModal }) => {
  const navigate = useNavigate();
  const { user, setUser, handleLogout } = useContext(UserContext);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsChanged(
      username !== user?.username || email !== user?.email || phone !== user?.phone
    );
  }, [username, email, phone, user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!isChanged) return;

    setLoading(true);
    try {

      const { data } = await axiosInstance.put("/profile", {
        username,
        email,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 text-xl bg-transparent"
          onClick={closeModal}
          aria-label="Close"
        >
          ❌
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-center text-blue-600">
          Edit Profile
        </h2>

        <form onSubmit={handleProfileSave} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>

          {/* Department - not editable */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role:</label>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm">
              {user.department}
            </p>
          </div>

          {/* Phone */}
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

          {/* Manager-only Admin Panel Button */}
          {user?.department === "manager" && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/admin-panel")}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
              >
                Go to Admin Panel
              </button>
            </div>
          )}

          {/* Buttons */}
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
