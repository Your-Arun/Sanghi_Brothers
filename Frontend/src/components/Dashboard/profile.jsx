import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ closeModal }) => {
  const [profile, setProfile] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({ username: "", email: "", department: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5500/profile", {
          withCredentials: true, // ✅ Send cookies for authentication
        });

        setProfile(response.data);
        setUpdatedProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        } else {
          alert("Failed to fetch profile data.");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleProfileSave = async () => {
    try {
      await axios.put("http://localhost:5500/profile", updatedProfile, {
        withCredentials: true, // ✅ Ensure cookies are sent
      });

      alert("Profile updated successfully!");
      setProfile(updatedProfile);
      closeModal(); // ✅ Close modal after save
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (!profile) return null; // ✅ Prevent rendering empty modal

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={closeModal} aria-label="Close">
          ❌
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Edit Profile</h2>

        <form>
          {[
            { label: "Name", value: updatedProfile.username, key: "username", editable: true },
            { label: "Email", value: updatedProfile.email, key: "email", editable: false },
            { label: "Role", value: updatedProfile.department, key: "department", editable: false },
          ].map(({ label, value, key, editable }) => (
            <div key={key} className="mb-4">
              <label className="block text-gray-700 font-semibold">{label}:</label>
              {editable ? (
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={value || ""}
                  onChange={(e) => setUpdatedProfile({ ...updatedProfile, [key]: e.target.value })}
                />
              ) : (
                <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100">{value || "N/A"}</p>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <button type="button" className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 hover:bg-gray-400 transition" onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" onClick={handleProfileSave}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
