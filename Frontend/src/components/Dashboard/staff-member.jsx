import React, { useState, useEffect } from "react";
import { FaMoneyBill, FaTruck, FaExclamationTriangle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import ProfileModal from "./profile";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [showFullReports, setShowFullReports] = useState(false);
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
            } catch (err) {
                console.error("Error fetching complaints:", err);
            }
        };
        fetchReports();
    }, []);

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
                {activeTab === "complaint" && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-blue-700 mb-4">🚨 Complaints</h2>

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

                        {/* See More Button */}
                        {reports.length > 4 && (
                            <div className="flex justify-center mt-4">
                                <button onClick={() => setShowFullReports(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                                    See More
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Full Reports Modal */}
            {showFullReports && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl relative">
                        <button onClick={() => setShowFullReports(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
                            ❌
                        </button>
                        <h2 className="text-xl font-bold text-center mb-4 text-blue-700">💰 Full Complaints Report</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {reports.map((item) => (
                                <div key={item._id} className="p-4 border rounded-lg bg-gray-100">
                                    <h1 className="text-lg font-bold text-green-700 text-center">{item.title}</h1>
                                    <h3 className="text-md font-semibold text-center text-gray-800">{item.department}</h3>
                                </div>
                            ))}
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
