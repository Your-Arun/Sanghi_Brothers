import React, { useState, useEffect } from "react";
import { FaMoneyBill, FaTruck, FaExclamationTriangle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import ProfileModal from "./profile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import addIcon from "/add.png";
import axiosInstance from "./axiosInstance";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsResponse, departmentResponse] = await Promise.all([
          axiosInstance.get("/reports"),
          axiosInstance.get("/departments"),
        ]);
        setReports(reportsResponse.data || []);
        setDepartments(departmentResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("🔥 Sending logout request...");
      
      const response = await axiosInstance.post("/logout", {}, { withCredentials: true });
  
      if (response.status === 200) {
        console.log("✅ Logout success");
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken"); // ✅ Remove token from storage
        alert("Logout Successfully");
        navigate("/login");
      }
    } catch (err) {
      console.error("❌ Logout failed:", err.response?.data?.message || err.message);
      
      // If the session is already expired, clear localStorage & navigate to login
      if (err.response?.status === 400) {
        localStorage.removeItem("userData");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Logout failed. Please try again.");
      }
    }
  };
  

  const openReportPage = () => {
    if (!selectedDepartment) {
      alert("Please select a department!");
      return;
    }
    navigate(`/report?department=${selectedDepartment}`);
    setShowModal2(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
    { id: "cashslip", label: "Cash Slip", icon: <FaMoneyBill /> },
    { id: "shifting", label: "Shifting Arrangement", icon: <FaTruck /> },
    { id: "complaint", label: "Complaints", icon: <FaExclamationTriangle /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-600 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">Staff Dashboard</h2>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 p-2 w-full rounded-lg transition ${
                activeTab === item.id ? "bg-blue-700" : "hover:bg-blue-500"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button onClick={() => setProfileOpen(true)} className="flex items-center gap-2 p-2 w-full bg-blue-700 rounded-lg hover:bg-blue-500">
            <FaUser /> Profile 
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 p-2 w-full bg-red-600 rounded-lg hover:bg-red-500 mt-4">
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {activeTab === "dashboard" && <div className="bg-white p-6 rounded-lg shadow-md text-center text-3xl">DASHBOARD</div>}

        {activeTab === "complaint" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center">
              <h2 className="text-3xl font-bold mb-4 mt-8 text-blue-700">🚨 Complaints</h2>
              <img
                src={addIcon}
                alt="Create"
                width={50}
                className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
                onClick={() => setShowModal2(true)}
              />
            </div>
            {loading ? (
              <p className="text-gray-500 text-center mt-4">Loading complaints...</p>
            ) : reports.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4 pb-3">
                {reports.map((report) => (
                  <div key={report._id} className="w-48 p-4 border rounded-xl shadow-md bg-white hover:bg-gray-100 cursor-pointer transform hover:scale-105">
                    <h3 className="text-xl text-green-700 font-bold text-center">{report.title}</h3>
                    <p className="text-md font-semibold text-center text-gray-800">📂 {report.department}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-4 italic">No complaints available.</p>
            )}
          </div>
        )}
      </main>

      {showModal2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowModal2(false)}>❌</button>
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Select a Department</h2>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="" disabled>-- Choose a Department --</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 hover:bg-gray-400" onClick={() => setShowModal2(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={openReportPage}>Proceed</button>
            </div>
          </div>
        </div>
      )}

      {isProfileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}
    </div>
  );
};

export default StaffDashboard;
