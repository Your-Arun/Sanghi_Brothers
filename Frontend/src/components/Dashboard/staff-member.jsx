import React, { useState, useEffect, useContext } from "react";
import {
  FaMoneyBill,
  FaTruck,
  FaExclamationTriangle,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsOpencollective } from "react-icons/bs";
import { IoCreateSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import ProfileModal from "./profile";
import ShiftComponent from "../Dashboard/Shift Component";
import UserContext from "../Home Page/UserContext";
import addIcon from "/add.png";

const StaffDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cashslip, setCashslip] = useState([]);
  const [lekha, setLekha] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showModal2, setShowModal2] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/profile", {
          withCredentials: true,
        });
        if (data?.user) setUser(data.user);
        else throw new Error("Session expired");
      } catch {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentRes, reportRes, cashierRes, lekhajokha] =
          await Promise.all([
            axiosInstance.get("/departments"),
            axiosInstance.get("/reports"),
            axiosInstance.get("/Cashslip"),
            axiosInstance.get("/newlekhajokha"),
          ]);
        setDepartments(departmentRes.data);
        setReports(reportRes.data);
        setCashslip(cashierRes.data);
        setLekha(lekhajokha.data);
      } catch {
        toast.error("Failed to fetch dashboard data");
      }
    };
    fetchData();
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
    { id: "cashslip", label: "Cash Slip", icon: <FaMoneyBill /> },
    { id: "shifting", label: "Shifting", icon: <FaTruck /> },
    { id: "complaint", label: "Complaints", icon: <FaExclamationTriangle /> },
    { id: "lekhajokha", label: "Lekha Jokha", icon: <BsOpencollective /> },
  ];

  const renderCard = (title, count, icon, color, tabId) => (
    <div
      onClick={() => setActiveTab(tabId)}
      className={`p-6 text-white rounded-xl shadow-md flex flex-col items-center cursor-pointer hover:scale-105 transition-all ${color}`}
    >
      {icon}
      <h3 className="text-lg font-bold mt-2">{title}</h3>
      <p className="text-2xl font-semibold">{count}</p>
    </div>
  );

  const openReportPage = () => {
    if (!selectedDepartment) return toast.warn("Select a department");
    navigate(`/report?department=${selectedDepartment}`);
    setShowModal2(false);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <aside
        className={`bg-blue-700 text-white p-4 w-64 fixed md:relative h-full z-40 transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
        <nav className="space-y-3">
          {navItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2 p-2 rounded-md transition ${
                activeTab === id ? "bg-blue-900" : "hover:bg-blue-600"
              }`}
            >
              {icon} <span>{label}</span>
            </button>
          ))}
          <button
            onClick={() => setProfileOpen(true)}
            className="w-full flex items-center gap-2 p-2 mt-3 bg-blue-800 rounded-md hover:bg-blue-600"
          >
            <FaUser /> Profile
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 ml-0 md:ml-64 bg-gray-50">
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Welcome, {user.username}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {renderCard("Complaints", reports.length, <FaExclamationTriangle size={28} />, "bg-blue-500", "complaint")}
              {renderCard("Cash Slips", cashslip.length, <FaMoneyBill size={28} />, "bg-green-500", "cashslip")}
              {renderCard("Shifting", "-", <FaTruck size={28} />, "bg-yellow-500", "shifting")}
              {renderCard("Lekha Jokha", lekha.length, <BsOpencollective size={28} />, "bg-purple-600", "lekhajokha")}
            </div>
          </div>
        )}

        {activeTab === "shifting" && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Shifting Arrangement</h2>
            <ShiftComponent />
          </div>
        )}

        {/* Add conditional render for complaint, cashslip, lekhajokha if needed */}
      </main>

      {isProfileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}

      <button
        className="fixed bottom-4 left-4 z-50 p-2 text-white bg-blue-600 rounded-full shadow-lg md:hidden"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {showModal2 && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Select Department</h2>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
            >
              <option value="">-- Select --</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal2(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={openReportPage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
