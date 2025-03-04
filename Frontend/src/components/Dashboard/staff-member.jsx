import React, { useState, useEffect } from "react";
import { FaMoneyBill, FaTruck, FaExclamationTriangle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import ProfileModal from "./profile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import addIcon from "/add.png"; // Make sure you have an image in the correct path

const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [showFullReports, setShowFullReports] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
    const navigate = useNavigate();

   // Logout Function
    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Logged out successfully!");
        navigate("/login");
    };

    // Fetch Complaints
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5500/reports", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReports(response.data);

                
        const departmentResponse = await axios.get(
            "http://localhost:5500/departments",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDepartments(departmentResponse.data);
  
            } catch (err) {
                console.error("Error fetching complaints:", err);
            }
        };
        fetchReports();
    }, []);

    // Handle Report Page Navigation
    const openReportPage = () => {
        if (!selectedDepartment) {
            alert("Please select a department!");
            return;
        }
        navigate(`/report/${selectedDepartment}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-600 text-white p-6 space-y-4">
                <h2 className="text-2xl font-bold">Staff Dashboard</h2>
                <nav className="space-y-3">
                    <button onClick={() => setActiveTab("dashboard")} className="flex items-center gap-2 p-2 w-full bg-blue-700 rounded-lg hover:bg-blue-500">
                        <LuLayoutDashboard /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab("cashslip")} className="flex items-center gap-2 p-2 w-full bg-blue-700 rounded-lg hover:bg-blue-500">
                        <FaMoneyBill /> Cash Slip
                    </button>
                    <button onClick={() => setActiveTab("shifting")} className="flex items-center gap-2 p-2 w-full bg-blue-700 rounded-lg hover:bg-blue-500">
                        <FaTruck /> Shifting Arrangement
                    </button>
                    <button onClick={() => setActiveTab("complaint")} className="flex items-center gap-2 p-2 w-full bg-blue-700 rounded-lg hover:bg-blue-500">
                        <FaExclamationTriangle /> Complaints
                    </button>
                    <button onClick={() => setProfileOpen(true)} className="flex items-center gap-2 p-2 w-full bg-blue-700 rounded-lg hover:bg-blue-500">
                        <FaUser /> Profile
                    </button>

                    {/* Logout Button */}
                    <button onClick={handleLogout} className="flex items-center gap-2 p-2 w-full bg-red-600 rounded-lg hover:bg-red-500 mt-4">
                        <FaSignOutAlt /> Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {activeTab === "dashboard" && <div className="bg-white p-6 rounded-lg shadow-md"><h1 className="text-3xl text-center">DASHBOARD</h1></div>}
                {activeTab === "cashslip" && <div className="bg-white p-6 rounded-lg shadow-md">Cash Slip Section</div>}
                {activeTab === "shifting" && <div className="bg-white p-6 rounded-lg shadow-md">Shifting Arrangement Section</div>}
                
                {/* Complaints Section */}
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

                        {/* Complaints List */}
                        {reports.length > 0 ? (
                            <div className="flex space-x-4 overflow-x-auto pb-3 scrollbar-hide">
                                {reports.slice(0, 4).map((report) => (
                                    <div key={report._id} className="min-w-[200px] p-4 border rounded-xl shadow-md bg-white hover:bg-gray-100 cursor-pointer transform hover:scale-105">
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

            {/* Department Selection Modal */}
            {showModal2 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" role="dialog">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowModal2(false)}
                            aria-label="Close"
                        >
                            ❌
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Select a Department</h2>

                        <select
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="" disabled>-- Choose a Department --</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 hover:bg-gray-400 transition"
                                onClick={() => setShowModal2(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                onClick={openReportPage}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {isProfileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}
        </div>
    );
};

export default StaffDashboard;
