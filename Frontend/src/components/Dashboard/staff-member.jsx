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
import ProfileModal from "./profile";
import { useNavigate } from "react-router-dom";
import addIcon from "/add.png";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import UserContext from "../Home Page/UserContext";
import ShiftComponent from "../Dashboard/Shift Component";

const StaffDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [cashslip, setCashslip] = useState([]);
  const [lekha, setLekha] = useState([]);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/profile", {
          withCredentials: true,
        });
        if (data?.user) setUser(data.user);
        else throw new Error("Session expired");
      } catch (err) {
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
            axiosInstance.get("/departments", { withCredentials: true }),
            axiosInstance.get("/reports", { withCredentials: true }),
            axiosInstance.get("/Cashslip", { withCredentials: true }),
            axiosInstance.get("/newlekhajokha", { withCredentials: true }),
          ]);
        setDepartments(departmentRes.data);
        setReports(reportRes.data);
        setCashslip(cashierRes.data);
        setLekha(lekhajokha.data);
      } catch {
        alert("Failed to fetch data.");
      }
    };
    fetchData();
  }, []);

  const openReportPage = () => {
    if (!selectedDepartment) return toast.warn("Please select a department!");
    navigate(`/report?department=${selectedDepartment}`);
    setShowModal2(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowToggleButton(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard />, route: '' },
    { id: "cashslip", label: "Cash Slip", icon: <FaMoneyBill />, route: '/cashslip' },
    { id: "shifting", label: "Shifting Arrangement", icon: <FaTruck />, route: '/shifting' },
    { id: "complaint", label: "Complaints", icon: <FaExclamationTriangle />, route: '/complaint' },
    { id: "lekhajokha", label: "Lekha Jokha", icon: <BsOpencollective />, route: '/lekhajokha' },
  ];

  if (loading) return <h3 className="text-center mt-20">Loading...</h3>;
  if (!user) return navigate("/login");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Toggle Button */}
      {showToggleButton && (
        <button
          className="toggle-btn fixed top-12 left-4 md:hidden"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      <aside
        className={`fixed inset-y-0 left-0 bg-gradient-to-b from-blue-700 to-blue-500 text-white p-6 w-64 md:w-1/4 lg:w-1/5 xl:w-1/6 z-40 shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center border-b border-blue-300 pb-4">
          STAFF PANEL
        </h2>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`sidebar-btn ${activeTab === item.id ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              setProfileOpen(true);
              setSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg bg-white text-blue-700 hover:bg-blue-100 font-semibold"
          >
            <FaUser /> Profile
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 overflow-y-auto max-h-screen bg-gray-50">
        <h1 className="text-2xl text-center font-bold mb-6 text-gray-800">
          Welcome, <span className="text-blue-600 mb-10">{user.username}</span>
        </h1>

        {/* ---------------- Dashboard ---------------- */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                id: "cashslip",
                label: "Cash Slips",
                count: cashslip.length,
                icon: <FaMoneyBill size={30} />,
              },
              {
                id: "shifting",
                label: "Shifting",
                count: "-",
                icon: <FaTruck size={30} />,
              },
              {
                id: "complaint",
                label: "Complaints",
                count: reports.length,
                icon: <FaExclamationTriangle size={30} />,
              },
              {
                id: "lekhajokha",
                label: "Lekha Jokha",
                count: lekha.length,
                icon: <BsOpencollective size={30} />,
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="cursor-pointer rounded-lg shadow-md overflow-hidden bg-white border border-gray-200 transition-transform hover:scale-105"
              >
                {/* Yellow curved top */}
                <div className="bg-yellow-400 p-4 relative">
                  <div className="text-black text-center">{item.icon}</div>
                  <div className="absolute bottom-0 left-0 w-full h-3 bg-white rounded-t-full"></div>
                </div>

                {/* Bottom content */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-gray-800">{item.label}</h3>
                  <p className="text-2xl font-semibold text-gray-700">
                    {item.count}
                    {item.id === "cashslip" || item.id === "lekhajokha" ? (
                      <span className="text-sm text-gray-500 ml-1">entries</span>
                    ) : null}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- Complaints ---------------- */}
        {activeTab === "complaint" && (
          <div className="bg-white p-6 mt-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-blue-700">Complaints</h2>
              <img
                src={addIcon}
                alt="Create"
                width={50}
                className="cursor-pointer transition-transform hover:scale-110 hover:rotate-12"
                onClick={() => navigate("/report")}
              />
            </div>

            {loading ? (
              <p className="text-gray-500 text-center mt-4">Loading complaints...</p>
            ) : reports.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer text-center"
                  >
                    <h3 className="text-lg font-bold text-green-700">{report.title}</h3>
                    <p className="text-gray-800">📂 {report.department}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic mt-4">No complaints available.</p>
            )}
          </div>
        )}

        {/* ---------------- Cash Slip ---------------- */}
        {activeTab === "cashslip" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mt-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800">💵 Cash Slips</h2>
              <button
                onClick={() => navigate("/Cashslip")}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition-transform hover:scale-105"
              >
                Submit New Cash Slip
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {cashslip.map((cashSlip, index) => (
                <div
                  key={index}
                  className="bg-white border p-4 rounded-lg shadow hover:shadow-md transition"
                >
                  <h3 className="text-blue-600 font-bold text-lg mb-2">{cashSlip.name}</h3>
                  <p><strong>Shift:</strong> {cashSlip.shift}</p>
                  <p><strong>Nozzle No:</strong> {cashSlip.nozzleNo}</p>
                  <p><strong>Opening:</strong> {cashSlip.openingReading}</p>
                  <p><strong>Closing:</strong> {cashSlip.closingReading}</p>
                  <p><strong>Sales:</strong> {cashSlip.salesInLtr} L</p>
                  <p className="mt-2 font-bold text-lg text-gray-900">
                    Total: ₹{cashSlip.total}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---------------- Lekha Jokha ---------------- */}
        {activeTab === "lekhajokha" && (
          <>
            <div className="bg-white flex items-center justify-between p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-3xl font-bold text-gray-800">⛽ Lekha Jokha</h2>
              <button
                onClick={() => navigate("/newlekhajokha")}
                className="text-2xl text-blue-600 hover:text-blue-800"
              >
                <IoCreateSharp />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {lekha.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition text-center"
                >
                  <h3 className="text-blue-600 font-bold text-lg">{item.username}</h3>
                  <p className="text-red-500">{item.department}</p>
                  <p className="text-gray-600">
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---------------- Shifting ---------------- */}
        {activeTab === "shifting" && (
          <div className="mt-4">
            <ShiftComponent />
          </div>
        )}
      </main>



      {showModal2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal2(false)}
            >
              ❌
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
              Select a Department
            </h2>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="" disabled>
                -- Choose a Department --
              </option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 hover:bg-gray-400"
                onClick={() => setShowModal2(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={openReportPage}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {isProfileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}
    </div>
  );
};

export default StaffDashboard;
