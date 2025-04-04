import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import UserContext from "../Home Page/UserContext"; // Import UserContext
import { toast } from 'react-toastify'

const Report = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Get user from context
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.department) {
      toast.warn("Error: No department found. Please log in again.");
      return;
    }

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.warn("No valid session found. Please log in.");
        return;
      }

      await axiosInstance.post(
        "/report",
        { title, department: user.department, content },
        { withCredentials: true }
      );
      toast.success("Report created successfully!");
      // Redirect based on user role
      if (user.department === "staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.warn("Failed to create the report. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">
          Create Report for {user?.department.toUpperCase() || "N/A"}
        </h2>
        <input
          type="text"
          className="w-full p-2 mb-2 border rounded"
          placeholder="Enter report title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 mb-2 border rounded"
          rows="6"
          placeholder="Enter report content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Create Report
        </button>
      </form>
    </div>
  );
};

export default Report;