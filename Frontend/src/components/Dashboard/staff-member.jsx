import React, { useState, useEffect, useContext } from "react";
import { FaMoneyBill, FaTruck, FaExclamationTriangle, FaUser } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import ProfileModal from "./profile";
import { useNavigate } from "react-router-dom";
import addIcon from "/add.png";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import UserContext from "../Home Page/UserContext"; // ✅ Import UserContext

const StaffDashboard = () => {
  const { user, setUser } = useContext(UserContext); // ✅ Get user from context
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [cashslip, setCashslip] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/profile", { withCredentials: true });

        if (data?.user) {
          setUser(data.user); // ✅ Store correct user data
        } else {
          throw new Error("Session expired");
        }
      } catch (err) {
        console.error("❌ Profile Fetch Error:", err.response?.data || err.message);
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } finally {
        setLoading(false); // ✅ Ensure loading state is updated
      }
    };
    fetchUser();
  }, [setUser, navigate]);


  // ✅ Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentRes, reportRes, cashierRes,] = await Promise.all([
          axiosInstance.get("/departments", { withCredentials: true }),
          axiosInstance.get("/reports", { withCredentials: true }),
          axiosInstance.get("/Cashslip", { withCredentials: true })

        ]); 

        setDepartments(departmentRes.data);
        setReports(reportRes.data);
        setCashslip(cashierRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to fetch data.");
      }
    };
    fetchData();
  }, []);
  const openReportPage = () => {
    if (!selectedDepartment) {
      toast.warn("Please select a department!");
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

  // ✅ Prevent blank screen by checking user & loading
  if (loading) return <h3 className="text-center mt-20">Loading...</h3>;
  if (!user) return <navigate to="/login" />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-600 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">Staff Dashboard</h2>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 p-2 w-full rounded-lg transition ${activeTab === item.id ? "bg-blue-700" : "hover:bg-blue-500"
                }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 p-2 w-full bg-blue-700 rounded-lg hover:bg-blue-500"
          >
            <FaUser /> Profile
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {activeTab === "dashboard" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-3xl">
              <h1> DASHBOARD</h1>
              <h3 className="text-xl">Welcome , <span className="text-red-500">{user.username}</span></h3>
            </div>
            <div>
            </div>
          </>
        )}

        {activeTab === "complaint" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center">
              <h2 className="text-3xl font-bold mb-4 mt-8 text-blue-700">
                🚨 COMPLAINTS
              </h2>
              <img
                src={addIcon}
                alt="Create"
                width={50}
                className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
                onClick={() => setShowModal2(true)}
              />
            </div>
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
        )}

        {activeTab === "cashslip" && (
          <>
            {/* Title */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-3xl font-bold text-gray-800">
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

        {activeTab === "shifting" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-3xl">
              SHIFTS ARRANGEMENT
            </div>
            <div></div>

          </>
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
