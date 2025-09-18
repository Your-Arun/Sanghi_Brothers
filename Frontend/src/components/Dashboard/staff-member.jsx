import React, { useState, useEffect, useContext } from "react";
import {
  FaMoneyBill,
  FaTruck,
  FaExclamationTriangle,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsOpencollective } from "react-icons/bs";
import ProfileModal from "./profile";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import UserContext from "../Home Page/UserContext";
import ShiftComponent from "../Dashboard/Shift Component";

const StaffDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [cashslip, setCashslip] = useState([]);
  const [lekha, setLekha] = useState([]);
  const [salepytm, setSalepytm] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  // 🔹 Cash Slip filters
  const [filter, setFilter] = useState("today");
  const [customDate, setCustomDate] = useState("");

  // helper function
  const formatDate = (dateString) =>
    new Date(dateString).toISOString().split("T")[0];

  // aaj ki date
  const today = new Date().toISOString().split("T")[0];

  const filteredSlips =
    filter === "today"
      ? cashslip.filter((s) => formatDate(s.date) === today)
      : filter === "other"
        ? cashslip.filter((s) => formatDate(s.date) !== today)
        : filter === "custom" && customDate
          ? cashslip.filter((s) => formatDate(s.date) === customDate)
          : cashslip;



  // 🔹 sync tab with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

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
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentRes, reportRes, cashierRes, lekhajokha, salepytmm] =
          await Promise.all([
            axiosInstance.get("/departments", { withCredentials: true }),
            axiosInstance.get("/reports", { withCredentials: true }),
            axiosInstance.get("/Cashslip", { withCredentials: true }),
            axiosInstance.get("/newlekhajokha", { withCredentials: true }),
            axiosInstance.get("/salepaytm", { withCredentials: true }),
          ]);
        setDepartments(departmentRes.data);
        setReports(reportRes.data);
        setCashslip(cashierRes.data);
        setLekha(lekhajokha.data);
        setSalepytm(salepytmm.data);
      } catch {
        toast.warning("Failed to fetch data.");
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
    { id: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
    { id: "cashslip", label: "Cash Slip", icon: <FaMoneyBill /> },
    { id: "shifting", label: "Shifting Arrangement", icon: <FaTruck /> },
    { id: "complaint", label: "Complaints", icon: <FaExclamationTriangle /> },
    { id: "lekhajokha", label: "Lekha Jokha", icon: <BsOpencollective /> },
    { id: "salepytm", label: "Sale&pytm", icon: <IoIosAlert /> },
  ];

  if (loading) return <h3 className="text-center mt-20">Loading...</h3>;
  if (!user) return navigate("/");

  const usernamee = user.username;
  const usernm = usernamee.toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-700 to-blue-500 text-white p-6 z-40 shadow-xl transform transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center border-b border-blue-300 pb-4">
          STAFF PANEL
        </h2>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
                navigate(`?tab=${item.id}`);
              }}
              className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-blue-600 transition font-medium whitespace-nowrap cursor-pointer text-sm ${activeTab === item.id ? "bg-white text-blue-700" : "text-white"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}

          {/* Profile Button */}
          <div
            onClick={() => {
              setProfileOpen(true);
              setSidebarOpen(false);
            }}
            className="flex items-center cursor-pointer gap-3 px-4 py-2 w-full rounded-lg bg-white text-blue-700 hover:bg-blue-100 font-semibold whitespace-nowrap text-sm"
          >
            <FaUser /> Profile
          </div>
        </nav>
      </aside>


      {/* Sidebar Toggle Btn */}
      {showToggleButton && !isSidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md text-blue-600 text-xl md:hidden hover:scale-110 transition-transform"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars />
        </button>
      )}
      {isSidebarOpen && (
        <button
          className="fixed top-3 left-3 z-50 p-2 bg-white rounded-full shadow-md text-blue-600 text-sm md:hidden hover:scale-110 transition-transform"
          onClick={() => setSidebarOpen(false)}
        >
          <FaTimes />
        </button>
      )}

      {/* Main Section */}
      <main className="flex-1 p-4 overflow-y-auto max-h-screen bg-gray-50">
        <h1 className="text-2xl text-center font-bold mb-6 text-gray-800">
          Welcome, <span className="text-blue-600 mb-10">{usernm}</span>
        </h1>

        {/* ---------------- Dashboard ---------------- */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Cash Slip Card */}
            <div onClick={() => {
              setActiveTab("cashslip");
              navigate("?tab=cashslip");
            }}
              className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Cash Slips</h2>
                  <p className="text-sm text-gray-500">Total Slips</p>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <FaMoneyBill className="text-xl" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-gray-700">{cashslip?.length || 0}</p>
            </div>

            {/* Complaints Card */}
            <div onClick={() => {
              setActiveTab("complaint");
              navigate("?tab=complaint");
            }} className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Complaints</h2>
                  <p className="text-sm text-gray-500">Active Issues</p>
                </div>
                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                  <FaExclamationTriangle className="text-xl" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-gray-700">{reports?.length || 0}</p>
            </div>

            {/* Lekha Jokha Card */}
            <div onClick={() => {
              setActiveTab("lekhajokha");
              navigate("?tab=lekhajokha");
            }} className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Lekha Jokha</h2>
                  <p className="text-sm text-gray-500">Entries Recorded</p>
                </div>
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                  <BsOpencollective className="text-xl" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-gray-700">{lekha?.length || 0}</p>
            </div>
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

            {/* 🔹 Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border px-4 py-2 rounded-lg shadow text-gray-700"
              >
                <option value="today">Today</option>
                <option value="other">Other</option>
                <option value="custom">Custom Date</option>
              </select>

              {filter === "custom" && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="border px-4 py-2 rounded-lg shadow text-gray-700"
                />
              )}
            </div>


            {/* 🔹 Filtered Cash Slips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {filteredSlips.length > 0 ? (
                filteredSlips.map((cashSlip, index) => (
                  <div
                    key={index}
                    className="bg-white border p-4 rounded-lg shadow hover:shadow-md transition"
                  >
                    <h3 className="text-blue-600 font-bold text-lg mb-2">
                      {cashSlip.name}
                    </h3>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(cashSlip.date).toLocaleDateString("en-GB")}
                    </p>
                    <p><strong>Shift:</strong> {cashSlip.shift}</p>
                    <p><strong>Nozzle No:</strong> {cashSlip.nozzleNo}</p>
                    <p><strong>Opening:</strong> {cashSlip.openingReading}</p>
                    <p><strong>Closing:</strong> {cashSlip.closingReading}</p>
                    <p><strong>Sales:</strong> {cashSlip.salesInLtr} L</p>
                    <p className="mt-2 font-bold text-lg text-gray-900">
                      Total: ₹{cashSlip.total}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">No slips found</p>
              )}
            </div>

          </>
        )}

        {/* ---------------- Complaints ---------------- */}
        {activeTab === "complaint" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mt-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800">📒 Complaints</h2>
              <button
                onClick={() => navigate("/report")}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition-transform hover:scale-105"
              >
                Create Complaint
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition text-center"
                >
                  <h3 className="text-green-700 font-bold text-lg">{report.title}</h3>
                  <p className="text-gray-800">📂 {report.department}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---------------- Shifting ---------------- */}
        {activeTab === "shifting" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mt-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800">🚚 Shifting Arrangement</h2>
            </div>
            <div className="mt-6">
              <ShiftComponent />
            </div>
          </>
        )}

        {/* ---------------- Lekha Jokha ---------------- */}
        {activeTab === "lekhajokha" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mt-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800">⛽ Lekha Jokha</h2>
              <button
                onClick={() => navigate("/newlekhajokha")}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition-transform hover:scale-105"
              >
                Create Entry
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
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

        {/* ---------------- Lekha Jokha ---------------- */}
        {activeTab === "salepytm" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mt-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800">💰 Sale & Paytm</h2>
              <button
                onClick={() => navigate("/salepytm")}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition-transform hover:scale-105"
              >
                Create Entry
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {salepytm.map((entry) => (
                <div
                  key={entry._id}
                  className="bg-white p-2 rounded-md shadow border text-[12px] hover:shadow-md hover:scale-105 cursor-pointer transition"
                  >
                  <p className="text-gray-500 text-[11px] mb-1">
                    {new Date(entry.date).toLocaleDateString()} | <b>{entry.shift}</b>
                  </p>

                  {/* Compact rows */}
                  <div className="space-y-0.2 max-h-30  pr-1">
                    {entry.rows.map((r, idx) => (
                      <div key={idx} className="flex justify-between text-center">
                        <span className="truncate w-14">{idx + 1}. {r.name || "—"}</span>
                        <span className="text-green-600">₹{r.sale || 0}</span>
                        <span className="text-yellow-600">₹{r.paytm || 0}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-1 border-t pt-1 font-bold text-blue-700 text-[12px]">
                    Sale: ₹{entry.totalSale} | Paytm: ₹{entry.totalPaytm}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}


      </main>

      {/* Department Modal */}
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
