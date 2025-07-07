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
            className="profile-btn w-full mt-4 flex items-center justify-center gap-2"
          >
            <FaUser />
            Profile
          </button>


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

      <main className="flex-1 p-4">
        <h1 className="text-2xl text-center font-bold mb-4">Welcome, {user.username}</h1>
        {activeTab === 'dashboard' && (
          <>
            {/* Dashboard Stats */}
            <div className="grid bg-transparent grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              <div onClick={() => setActiveTab("complaint")} // 👈 Complaint tab open hoga
                className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center">
                <FaExclamationTriangle size={40} />
                <h3 className="text-xl font-bold"  >Complaints</h3>
                <p className="text-3xl font-semibold">{reports.length}</p>
              </div>
              <div onClick={() => setActiveTab("cashslip")} className="bg-green-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center">
                <FaMoneyBill size={40} />
                <h3 className="text-xl font-bold">Cash Slips</h3>
                <p className="text-3xl font-semibold">{cashslip.length}</p>
              </div>
              <div onClick={() => setActiveTab("shifting")} className="bg-yellow-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center">
                <FaTruck size={40} />
                <h3 className="text-xl font-bold">Shifting Arrangements</h3>
                <p className="text-3xl font-semibold"></p> {/* Replace with actual count if available */}
              </div>
              <div onClick={() => setActiveTab("lekhajokha")} className="bg-purple-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center">
                <BsOpencollective size={40} />
                <h3 className="text-xl font-bold">Lekha Jokha</h3>
                <p className="text-3xl font-semibold">{lekha.length}</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "complaint" && (
          <div className="bg-white p-6 rounded-lg shadow-md ">
            <div className="flex flex-col items-center justify-center sm:flex-row">
              <div>
                <h2 className="text-3xl font-bold mb-4 mt-4 text-blue-700">
                  COMPLAINTS
                </h2>
              </div>
              <div><img
                src={addIcon}
                alt="Create"
                width={50}
                className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
                onClick={() => (navigate('/report'))}
              /></div>
            </div>
            <div>
              {loading ? (
                <p className="text-gray-500 text-center mt-4">
                  Loading complaints...
                </p>
              ) : reports.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4 pb-3">
                  {reports.map((report) => (
                    <div
                      key={report._id}
                      className="w-48 p-4 border rounded-xl shadow-md bg-white hover:bg-gray-100 cursor-pointer transform hover:scale-105"
                    >
                      <h3 className="text-xl text-green-700 font-bold text-center">
                        {report.title}
                      </h3>
                      <p className="text-md font-semibold text-center text-gray-800">
                        📂 {report.department}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-4 italic">
                  No complaints available.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "cashslip" && (
          <>
            {/* Title */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center text-3xl font-bold text-gray-800 mt-4 md:mt-0">
              💵 CASH SLIPS
            </div>

            {/* Navigation Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate("/Cashslip")}
                className="bg-purple-500 text-white flex items-center px-6 py-3 rounded-lg shadow-lg hover:bg-purple-600 transform hover:scale-105 transition-all ease-in-out"
                aria-label="Cash Slip"
              >
                <span className="text-xl">💵</span>
                <span className="ml-2 text-lg font-semibold">Submit Cash Slip</span>
              </button>
            </div>

            {/* Cash Slip Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {cashslip.map((cashSlip, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all"
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">{cashSlip.name}</h3>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Shift:</strong> {cashSlip.shift}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Nozzle No:</strong> {cashSlip.nozzleNo}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Opening:</strong> {cashSlip.openingReading}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Closing:</strong> {cashSlip.closingReading}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Sales:</strong> {cashSlip.salesInLtr} L
                  </p>
                  <p className="text-gray-900 text-lg font-semibold mt-2">
                    <strong>Total:</strong> ₹{cashSlip.total}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "lekhajokha" && (
          <>
            <div className="bg-white flex p-6 rounded-lg shadow-md text-center text-3xl font-bold text-gray-800 justify-center gap-8">
              <div className="flex flex-col mt-4 gap-4 items-center justify-center sm:flex-row sm:mt-0">
                <div>⛽Lekha Jokha</div>
                <div className="cursor-pointer" onClick={() => (navigate("/newlekhajokha"))}><IoCreateSharp />
                </div>
              </div>
            </div>
            <div>
              {/* Reports Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
                {lekha.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white shadow-md p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-all text-center"
                  >
                    <h3 className="text-lg font-bold text-blue-600">{item.username}</h3>
                    <p className="text-md font-medium text-red-500">{item.department}</p>
                    <p className="text-md font-medium text-gray-700">
                      {new Date(item.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </>
        )}

        {activeTab === "shifting" && <ShiftComponent />}
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
    </div>
  );
};

export default StaffDashboard;
