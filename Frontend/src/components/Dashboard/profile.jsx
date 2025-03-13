import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileModal = ({ closeModal }) => {
  const [profile, setProfile] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({ username: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5500/profile", {
          withCredentials: true, // ✅ Session-based request
        });
  
        console.log("Fetched Profile:", data);
        setProfile(data);
        setUpdatedProfile({ username: data.username });
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        toast.error("Failed to fetch profile.");
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put("/profile", { username: updatedProfile.username });

      setProfile(data);
      closeModal();
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  
  

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md text-center">
          <p className="text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md relative">
        <button className="absolute top-4 right-4 text-gray-500" onClick={closeModal}>❌</button>

        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Edit Profile</h2>

        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Name:</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={updatedProfile.username || ""}
              onChange={(e) => setUpdatedProfile({ ...updatedProfile, username: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email:</label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100">
              {profile.email}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Role:</label>
            <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100">
              {profile.department}
            </p>
          </div>

          <div className="flex justify-between">
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={handleLogout}>
              Logout
            </button>
            <div>
              <button className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2" onClick={closeModal}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handleProfileSave} disabled={loading}>
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
