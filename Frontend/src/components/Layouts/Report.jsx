import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Report = () => {
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [role, setRole] = useState("");  // Pre-fill fields with user's role
  const department = new URLSearchParams(location.search).get("department");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("authToken"); // ✅ Use sessionStorage
        const role = await axios.get('http://localhost:5500/departments')
        console.log(role.data)
        setRole(role.data)
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Failed to fetch profile data.");
      }
    };

    fetchProfile();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5500/report",
        { title, department, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Report created successfully!");

      // Redirect based on user role
      if (role === "staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create the report. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold mb-4">
          Create Report for {department}
        </h2>
        <input
          type="text"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Enter report title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 mb-2 border rounded"
          rows="6"
          placeholder="Enter report content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Create Report
        </button>
      </form>
    </div>
  );
};

export default Report;
