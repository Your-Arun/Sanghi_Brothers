import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import add from "/add.png";
import { FaTimes, FaTrash, FaUniversity } from "react-icons/fa";
import ProfileModal from "./profile";
import axiosInstance from './axiosInstance'
import UserContext from '../Home Page/UserContext'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [reports, setReports] = useState([]); // State to hold reports
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null); // Selected report for editing
  const [isEditing, setIsEditing] = useState(false); // Control edit modal
  const [updatedContent, setUpdatedContent] = useState(""); // Content for editing
  const [updatedTitle, setUpdatedTitle] = useState(""); // Content for editing
  const navigate = useNavigate();
  const [reportfile, setReportFile] = useState([]);
  const [sb3update, setSb3Update] = useState([]);
  const [cashier, setCashier] = useState([]);
  const [cashierTotal, setCashierTotal] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { user } = useContext(UserContext); // Getting user from context

  const confirmDeleteToast = (onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this ?</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => {
                onConfirm()
                closeToast()
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentRes, reportRes, sb3Res, cashierRes, reportfilee] = await Promise.all([
          axiosInstance.get("/departments", { withCredentials: true }),
          axiosInstance.get("/reports", { withCredentials: true }),
          axiosInstance.get("/bank/monthlyfundflow", { withCredentials: true }),
          axiosInstance.get("/cashier", { withCredentials: true }),
          axiosInstance.get("/reportfile", { withCredentials: true })
        ]);

        setDepartments(departmentRes.data);
        setReports(reportRes.data);
        setSb3Update(sb3Res.data);
        setCashier(cashierRes.data);
        setCashierTotal(cashierRes.data.totalamount);
        setReportFile(reportfilee.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch data.");
      }
    };
    fetchData();
  }, []);

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null); // Close modal
  };

  const handleDeleteReport = async (reportId) => {
    confirmDeleteToast(async () => {
      try {
        await axiosInstance.delete(`/reports/${reportId}`, { withCredentials: true });
        setReports((prev) => prev.filter((report) => report._id !== reportId));
        toast.success("Report deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete report. Please try again.");
      }
    })
  };

  const handleUpdateReport = async () => {
    try {
      if (!selectedReport || !selectedReport._id) {
        toast.error("No report selected for update.");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: Please log in again.");
        return;
      }
      const updatedReport = { title: updatedTitle, content: updatedContent };
      const response = await axiosInstance.put(
        `/reports/${selectedReport._id}`,
        updatedReport,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report._id === selectedReport._id ? { ...report, ...updatedReport } : report
          )
        );
        setShowModal(false);
        toast.success("Report updated successfully!");
      } else {
        toast.error("Failed to update report.");
      }
    } catch (err) {
      toast.error("Failed to update report. Please try again.");
    }
  };

  const viewReports = (department) => {
    if (!user || !user.department) {
      toast.error("Could not determine your access level. Please try again.");
      return;
    }
    const userDepartment = user.department.toLowerCase();
    const departmentNormalized = department.toLowerCase();
    if (userDepartment === "manager" || userDepartment === departmentNormalized) {
      navigate(`/department-reports?department=${department}`);
    } else {
      toast.error("You are not authorized to view reports for this department.");
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-r from-blue-400 to-yellow-400 items-center justify-center min-h-screen p-6">
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-8 px-4">
        {/* Dashboard Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold uppercase font-serif 
        text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500 
        drop-shadow-lg text-left">
          Dashboard
        </h1>

        {/* User Menu */}
        <div className="relative user-menu">
          <div className="flex items-center justify-center">
            <img
              src="/user.png"
              alt="User"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-400 shadow cursor-pointer
          hover:scale-105 transition-transform duration-300"
              onClick={() => setProfileOpen(true)}
            />
            {isProfileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}
          </div>
        </div>
      </div>


      <div>
        <div className="mb-16 p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-teal-700">
              Departments
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {["Manager", "Accounts/Finance", "Backoffice"].map((dept) => (
                <div
                  key={dept}
                  className="p-6 border bg-yellow-200 rounded-xl shadow-md hover:bg-yellow-300 cursor-pointer transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg"
                  onClick={() => viewReports(dept.toLowerCase())}
                >
                  <h3 className="text-xl font-bold text-orange-700 uppercase">{dept}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10 p-6 w-[90%] rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <h2 className="text-3xl font-bold mb-4 mt-8 text-blue-700">
            BANK Related Reports
          </h2>
          <img
            src={add}
            alt="Create"
            width={50}
            className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
            onClick={() => navigate("/bankreport")}
          />
        </div>
      </div>
      <div className="mb-10 p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <h2 className="text-3xl font-bold mb-4 mt-8 text-blue-700">
            Report File
          </h2>
          <img
            src={add}
            alt="Create"
            width={50}
            className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
            onClick={() => navigate("/reportfile")}
          />
        </div>
        <div className="flex space-x-4 justify-center overflow-x-auto pb-3 scrollbar-hide">
          {reportfile.slice(0, 4).map((report) => (
            <div
              key={report._id}
              onClick={() => navigate(`/reportfile/${report._id}`)}
              className="min-w-[200px] p-4 border rounded-xl shadow-md bg-white hover:bg-gray-100 cursor-pointer transition duration-300 transform hover:scale-105"
            >
              <h1 className="text-xl text-green-700 font-bold text-center">{report.department}</h1>
              <h3 className="text-md font-semibold text-center text-gray-800 mt-2 flex items-center justify-center gap-1">
                {new Date(report.entryDate).toLocaleDateString()}
              </h3>
              <h3 className="text-md font-semibold text-center text-gray-800 mt-2 flex items-center justify-center gap-1">
                Cash Sales: ₹{report.reports.cashsales}
              </h3>
            </div>
          ))}
        </div>
        {reportfile.length > 4 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsOpen3(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              See More
            </button>
          </div>
        )}
        {isOpen3 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl relative">
              <button
                onClick={() => setIsOpen3(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              >
                <FaTimes className="text-2xl" />
              </button>
              <h2 className="text-xl font-bold text-center mb-4 text-blue-700">Full Reportfiles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reportfile.map((item) => (
                  <div key={item._id} className="p-4 border rounded-lg bg-gray-100 cursor-pointer transition duration-300 ease-in-out hover:text-lg hover:scale-110" onClick={() => navigate(`/reportfile/${item._id}`)}>
                    <h1 className="text-lg font-bold text-green-700 text-center">{item.department}</h1>
                    <h3 className="text-sm text-gray-600 text-center">{new Date(item.entryDate).toLocaleDateString()}</h3>
                    <h3 className="text-md font-semibold text-center text-gray-800 flex items-center justify-center gap-1">
                      Cash Sales: {item.reports.cashsales}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mb-10 p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <h2 className="text-3xl font-bold mb-4 mt-8 text-blue-700">Cashier Kaam</h2>
          <img
            src={add}
            alt="Create"
            width={50}
            className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
            onClick={() => navigate("/cashier")}
          />
        </div>
        <div className="flex space-x-4 justify-center overflow-x-auto pb-3 scrollbar-hide">
          {cashier.slice(0, 4).map((item) => (
            <div
              key={item._id}
              className="min-w-[200px] p-4 border rounded-xl shadow-md bg-white hover:bg-gray-100 cursor-pointer transition duration-300 transform hover:scale-105"
            >
              <h1 className="text-xl text-green-700 font-bold text-center">₹{item.amount}</h1>
              <h3 className="text-md font-semibold text-center text-gray-800 mt-2 flex items-center justify-center gap-1">
                <FaUniversity className="text-blue-600" /> {item.bank}
              </h3>
              <h3 className="text-sm text-gray-600 text-center mt-1">
                {new Date(item.date).toLocaleDateString()}
              </h3>
            </div>
          ))}
        </div>
        {cashier.length > 4 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              See More
            </button>
          </div>
        )}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              >
                <FaTimes className="text-2xl" />
              </button>
              <h2 className="text-xl font-bold text-center mb-4 text-blue-700">Full Cashier Report</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cashier.map((item) => (
                  <div key={item._id} className="p-4 border rounded-lg bg-gray-100 cursor-pointer transition duration-300 ease-in-out hover:text-lg hover:scale-110">
                    <h1 className="text-lg font-bold text-green-700 text-center">₹{item.amount}</h1>
                    <h3 className="text-md font-semibold text-center text-gray-800 flex items-center justify-center gap-1">
                      <FaUniversity className="text-blue-600" /> {item.bank}
                    </h3>
                    <h3 className="text-sm text-gray-600 text-center">{new Date(item.date).toLocaleDateString()}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mb-10 p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <h2 className="text-3xl font-bold mb-4 mt-8 text-blue-700">Complaints</h2>
          <img
            src={add}
            alt="Create"
            width={50}
            className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
            onClick={() => navigate("/report")}
          />
        </div>
        <div className="flex space-x-4 justify-center overflow-x-auto pb-3 scrollbar-hide">
          {reports.slice(0, 4).map((report) => (
            <div
              key={report._id}
              onClick={() => handleReportClick(report)}
              className="min-w-[200px] p-4 border rounded-xl shadow-md bg-white hover:bg-gray-100 cursor-pointer transition duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl text-green-700 font-bold text-center">TITLE: {report.title}</h3>
              <p className="text-md font-semibold text-center text-gray-800 mt-2 flex items-center justify-center gap-1">
                DEPARTMENT: {report.department}
              </p>
              <p className="mt-3 text-gray-800 text-center line-clamp-2">CONTENT: {report.content}</p>
              <button
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg w-full hover:bg-red-600 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteReport(report._id);
                }}
              >
                <FaTrash /> Delete
              </button>
            </div>
          ))}
        </div>
        {reports.length > 4 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsOpen2(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              See More
            </button>
          </div>
        )}
        {isOpen2 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setIsOpen2(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              >
                <FaTimes className="text-2xl" />
              </button>
              <h2 className="text-xl font-bold text-center mb-4 text-blue-700">Full Complaints Report</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reports.map((item) => (
                  <div key={item._id} className="p-4 border rounded-lg bg-gray-100 cursor-pointer transition duration-300 ease-in-out hover:text-lg hover:scale-110">
                    <h1 className="text-lg font-bold text-green-700 text-center">{item.title}</h1>
                    <h3 className="text-md font-semibold text-center text-gray-800 flex items-center justify-center gap-1">
                      {item.department}
                    </h3>
                    <button
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg w-full hover:bg-red-600 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReport(item._id);
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <h2 className="text-2xl font-bold text-green-700 text-center">
                {selectedReport.title}
              </h2>
              <p className="text-md font-semibold text-center text-gray-800 mt-2">
                <strong>Department:</strong> {selectedReport.department}
              </p>
              <p className="mt-4 text-gray-700 text-center">
                {selectedReport.content}
              </p>
              <button
                onClick={closeModal}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="relative flex flex-col items-center mt-6">
        <div className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          <button
            onClick={() => navigate("/shifting")}
            className="bg-red-500 text-white flex items-center px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transform hover:scale-105 transition-all ease-in-out w-full"
          >
            👫 <span className="ml-2">SHIFTING ARRANGEMENT</span>
          </button>
          <button
            onClick={() => navigate("/lekhajokha")}
            className="bg-orange-500 text-white flex items-center px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transform hover:scale-105 transition-all ease-in-out w-full"
          >
            📄 <span className="ml-2">LEKHA JOKHA</span>
          </button>
          <button
            onClick={() => navigate("/exceluploader")}
            className="bg-blue-500 text-white flex items-center px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all ease-in-out w-full"
            aria-label="Upload File"
          >
            📤 <span className="ml-2">UPLOAD FILE</span>
          </button>
          <button
            onClick={() => navigate("/createmeterclose")}
            className="bg-purple-500 text-white flex items-center px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 transform hover:scale-105 transition-all ease-in-out w-full"
            aria-label="Meter Close"
          >
            🔒 <span className="ml-2">METER CLOSE</span>
          </button>
          <button
            onClick={() => navigate("/Cashslip")}
            className="bg-purple-500 text-white flex items-center px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 transform hover:scale-105 transition-all ease-in-out w-full"
            aria-label="Cash Slip"
          >
            💵 <span className="ml-2">Cash Slip</span>
          </button>
        </div>
      </div>
      {isEditing && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          role="dialog"
          aria-labelledby="edit-report-modal-title"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditing(false)}
              aria-label="Close"
            >
              ❌
            </button>
            <h2
              id="edit-report-modal-title"
              className="text-2xl font-bold mb-4 text-center text-blue-600"
            >
              Edit Report
            </h2>
            <form>
              {[
                { label: "Title", value: updatedTitle, setValue: setUpdatedTitle },
                { label: "Content", value: updatedContent, setValue: setUpdatedContent, type: "textarea" }
              ].map(({ label, value, setValue, type = "text" }) => (
                <div key={label} className="mb-4">
                  <label className="block text-gray-700 font-semibold">{label}:</label>
                  {type === "text" ? (
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  ) : (
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="6"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    ></textarea>
                  )}
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 hover:bg-gray-400 transition"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  onClick={handleUpdateReport}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;