import React, { useState, useEffect } from "react";
import { FaMoneyBill, FaTruck, FaExclamationTriangle, FaUser, FaSignOutAlt, FaTrash } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import ProfileModal from "./profile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import addIcon from "/add.png";

const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5500/reports", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReports(response.data);

                const departmentResponse = await axios.get("http://localhost:5500/departments", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDepartments(departmentResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Logged out successfully!");
        navigate("/login");
    };

    const openReportPage = () => {
        if (!selectedDepartment) {
            alert("Please select a department!");
            return;
        }
        navigate(`/report?department=${selectedDepartment}`);
        setShowModal2(false);
    };

    const handleDeleteReport = async (reportId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this report?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5500/reports/${reportId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setReports(reports.filter((report) => report._id !== reportId));
            alert("Report deleted successfully!");
        } catch (error) {
            console.error("Error deleting report:", error);
            alert("Failed to delete report. Please try again.");
        }
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
                    <button onClick={handleLogout} className="flex items-center gap-2 p-2 w-full bg-red-600 rounded-lg hover:bg-red-500 mt-4">
                        <FaSignOutAlt /> Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
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
                        {reports.length > 0 ? (
                            <div className="grid grid-cols-5 space-x-4 overflow-x-auto pb-3 scrollbar-hide">
                                {reports.map((report) => (
                                    <div key={report._id} className="min-w-[200px] p-4 border rounded-xl shadow-md bg-white hover:bg-gray-100 cursor-pointer transform hover:scale-105">
                                        <h3 className="text-xl text-green-700 font-bold text-center">{report.title}</h3>
                                        <p className="text-md font-semibold text-center text-gray-800">📂 {report.department}</p>
                                        <button
                                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg w-full hover:bg-red-600 flex items-center justify-center gap-2"
                                            onClick={() => handleDeleteReport(report._id)}
                                        >
                                            <FaTrash /> Delete
                                        </button>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md relative">
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowModal2(false)}>❌</button>
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
                            <button className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 hover:bg-gray-400 transition" onClick={() => setShowModal2(false)}>Cancel</button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" onClick={openReportPage}>Proceed</button>
                        </div>
                    </div>
                </div>
            )}

            {isProfileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}
        </div>
    );
};

export default StaffDashboard;
