import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileModal = ({ closeModal }) => {
  const [profile, setProfile] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({
    username: "",
    email: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5500/profile", {
          withCredentials: true, // Ensure cookies are sent
        });
        console.log("Profile Data:", data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    

    fetchProfile();
  }, [navigate]);

  const handleProfileSave = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("Session expired. Please log in again.");

    setLoading(true);
    try {
      await axios.put("http://localhost:5500/profile", updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully!");
      setProfile(updatedProfile);
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5500/logout", {}, { withCredentials: true });

      localStorage.removeItem("authToken");
      setProfile(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed. Try again.");
    }
  };

  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={closeModal}>
          ❌
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Edit Profile</h2>

        <form>
          {[
            { label: "Name", key: "username", editable: true },
            { label: "Email", key: "email", editable: false },
            { label: "Role", key: "department", editable: false },
          ].map(({ label, key, editable }) => (
            <div key={key} className="mb-4">
              <label className="block text-gray-700 font-semibold">{label}:</label>
              {editable ? (
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updatedProfile[key] || ""}
                  onChange={(e) =>
                    setUpdatedProfile((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              ) : (
                <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100">
                  {updatedProfile[key] || "N/A"}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
            <div>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 hover:bg-gray-400 transition"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={handleProfileSave}
                disabled={loading}
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
