import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import add from "/add.png";
import { FaTimes, FaTrash, FaUniversity } from "react-icons/fa";
const Dashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [reports, setReports] = useState([]); // State to hold reports
  const [showModal2, setShowModal2] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedReport, setSelectedReport] = useState(null); // Selected report for editing
  const [isEditing, setIsEditing] = useState(false); // Control edit modal
  const [updatedContent, setUpdatedContent] = useState(""); // Content for editing
  const [updatedTitle, setUpdatedTitle] = useState(""); // Content for editing
  const [showProfileModal, setShowProfileModal] = useState(false); // Toggle profile modal
  const [profile, setProfile] = useState({}); // Profile data
  const [updatedProfile, setUpdatedProfile] = useState({});
  const navigate = useNavigate();
  const [reportfile, setReportFile] = useState([]);
  const [sb3update, setSb3Update] = useState([]);
  const [cashier, setCashier] = useState([]);
  const [cashierTotal, setCashierTotal] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);


  useEffect(() => {
    const checkUserAuthentication = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5500/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!data || !data.username) {
          navigate("/login");
        } else {
          setUserName(data.username);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    checkUserAuthentication();
  }, [navigate]);

  //reportfile ke lie
  useEffect(() => {
    const fetchrepoFile = async () => {
      try {
        const token = localStorage.getItem("token");

        const responsee = await axios.get("http://localhost:5500/reportfile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportFile(responsee.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchrepoFile();
  }, []);

  const handleLogout = () => {
    // Clear user token and redirect to login
    localStorage.removeItem("token");
    navigate("/login");
    alert("Logout SuccessFully");
  };
  //profile ke lie
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5500/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setUpdatedProfile(response.data);
      setUserName(response.data.username); // Pre-fill editable fields
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Failed to fetch profile data.");
    }
  };

  const handleProfileSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5500/profile",
        updatedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setProfile(updatedProfile); // Update local state
        setShowProfileModal(false); // Close modal
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };
  // department and report ke lie get kr rhe h
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No valid token found. Please log in.");
          return; // Exit early if no token
        }

        const departmentResponse = await axios.get(
          "http://localhost:5500/departments",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDepartments(departmentResponse.data);

        const reportsResponse = await axios.get(
          "http://localhost:5500/reports",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReports(reportsResponse.data);

        const sb3resp = await axios.get(
          `http://localhost:5500/bank/monthlyfundflow`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSb3Update(sb3resp.data);
        const response = await axios.get("http://localhost:5500/cashier", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCashier(response.data);
        setCashierTotal(response.data.totalamount)
      } catch (err) {
        console.error("Error fetching data:");
        alert("Failed to fetch data.");
      }
    };
    fetchData();
  }, []);

  const handleReportClick = (report) => {
    setSelectedReport(report); // Set the selected report for editing
    setUpdatedContent(report.content);
    setUpdatedTitle(report.title); // Populate the modal with existing content
    setIsEditing(true); // Show the modal
    setShowModal(true);
  };
  const handleUpdateReport = async () => {
    try {
      // Check if token is present
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authorization token found. Please log in again.");
        return;
      }

      // Check if selectedReport exists
      if (!selectedReport || !selectedReport._id) {
        alert("No report selected for update.");
        return;
      }

      // Prepare updated report data
      const updatedReport = {
        ...selectedReport,
        title: updatedTitle,
        content: updatedContent,
      };

      // Log the updated report data for debugging
      console.log("Updating report with data:", updatedReport);

      // Send the update request to the server
      const response = await axios.put(
        `http://localhost:5500/reports/${selectedReport._id}`,
        updatedReport,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Check server response
      console.log("Server response:", response);

      if (response.status === 200) {
        // Update the local state with the updated report
        setReports((prevReports) =>
          prevReports.map((report) =>
            report._id === selectedReport._id ? updatedReport : report
          )
        );
        setIsEditing(false); // Close the modal after successful update
        alert("Report updated successfully!");
      } else {
        alert("Failed to update report.");
      }
    } catch (err) {
      // Capture and log the error details
      console.error(
        "Error during report update:",
        err.response?.data || err.message
      );
      alert("Failed to update report. Please try again.");
    }
  };
  // View Reports Function
  const viewReports = (department) => {
    const userDepartment = localStorage.getItem("userDepartment")?.toLowerCase(); // Normalize
    const departmentNormalized = department.toLowerCase(); // Normalize department

    if (userDepartment === "manager") {
      // ✅ Manager ko teeno departments ka access hai
      navigate(`/department-reports?department=${department}`);
    } else if (
      (userDepartment === "accounts/finance" && departmentNormalized === "accounts/finance") ||
      (userDepartment === "backoffice" && departmentNormalized === "backoffice")
    ) {
      // ✅ Account wale ko sirf "Accounts/Finance" aur Backoffice wale ko sirf "Backoffice" access milega
      navigate(`/department-reports?department=${department}`);
    } else {
      // ❌ Unauthorized access
      alert("You are not authorized to view reports for this department.");
    }
  };

  const openReportPage = () => {
    if (selectedDepartment) {
      navigate(`/report?department=${selectedDepartment}`);
      setShowModal2(false);
    } else {
      alert("Please select a department!");
    }
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
    <>
      <div className="relative p-6 dashboard  min-h-screen">
        <h1 className="text-5xl font-extrabold uppercase font-serif text-center 
                text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500 
                drop-shadow-lg mt-[-10px] mb-8">
          Dashboard
        </h1>


        <div className="relative mb-4">
          {/* Profile Icon with Proper Spacing */}
          <div className="flex items-center justify-end pr-6">
            <img
              src="public/user.png"
              alt="User"
              className="w-12 h-12 rounded-full border-2 border-gray-400 shadow-md cursor-pointer
                  hover:scale-105 transition-transform duration-300"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
          </div>

          {/* Dropdown Menu with Proper Positioning */}
          {showUserMenu && (
            <div className="absolute right-6 top-14 w-44 bg-white rounded-lg shadow-lg border border-gray-200
                      transition-all duration-300 ease-in-out z-50">
              <button
                className="block px-4 py-2 text-left w-full text-gray-700 font-medium hover:bg-gray-100 
                    transition-all duration-200"
                onClick={() => {
                  fetchProfile();
                  setShowProfileModal(true);
                  setShowUserMenu(false);
                }}
              >
                👤 Profile
              </button>
              <button
                className="block px-4 py-2 text-left w-full text-red-500 font-medium hover:bg-red-100 
                    transition-all duration-200"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>


        <div>
          {/* Departments Section */}
          <div className="mb-10 p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-center text-teal-700">
                🏢 Departments
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {["Manager", "Accounts/Finance", "Backoffice"].map((dept) => (
                  <div
                    key={dept}
                    className="p-6 border bg-yellow-200 rounded-xl shadow-md hover:bg-yellow-300 cursor-pointer transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg"
                    onClick={() => viewReports(dept.toLowerCase())} // ✅ Fix
                  >
                    <h3 className="text-xl font-bold text-orange-700 uppercase">{dept}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>



        {/* sb section ke lie */}
        <div className="mb-10 p-6  rounded-lg shadow-md">
          {/* Heading */}
          <div className="flex items-center justify-center">
            <h2 className="text-3xl font-bold mb-4 mt-8 text-blue-700">
              📊 BANK Related Reports
            </h2>
            <img
              src={add}
              alt="Create"
              width={50}
              className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
              onClick={() => navigate("/bankreport")}
            /></div>
          {/* Report List */}
          {reportfile.length > 0 ? (
            <div className="flex space-x-4 justify-center overflow-x-auto pb-3 scrollbar-hide">
              {reportfile.slice(0, 4).map((report) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/reportfile/${report._id}`)}
                  className="min-w-[200px] p-4 border rounded-xl shadow-md bg-white hover:bg-gray-100 cursor-pointer transition duration-300 transform hover:scale-105"
                >
                  <h1 className="text-xl text-green-700 font-bold text-center">
                    {report.department}
                  </h1>
                  <h3 className="text-md font-semibold text-center text-gray-800 mt-2 flex items-center justify-center gap-1">
                    📅 {new Date(report.entryDate).toLocaleDateString()}
                  </h3>
                  <h3 className="text-md font-semibold text-center text-gray-800 mt-2 flex items-center justify-center gap-1">
                    💵 Cash Sales: ₹{report.reports.cashsales}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-4">No reports available.</p>
          )}

          {/* See More Button */}
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
          {/* Modal for Full List */}
          {isOpen3 && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl relative">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen3(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                >
                  <FaTimes className="text-2xl" />
                </button>

                <h2 className="text-xl font-bold text-center mb-4 text-blue-700"> Full Reportfiles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reportfile.map((item) => (
                    <div key={item._id} className="p-4 border rounded-lg bg-gray-100 cursor-pointer transition duration-300 ease-in-out hover:text-lg hover:scale-110" onClick={() => navigate(`/reportfile/${item._id}`)}>
                      <h1 className="text-lg font-bold text-green-700 text-center">₹{item.department}</h1>
                      <h3 className="text-sm text-gray-600 text-center">📅 {new Date(item.entryDate).toLocaleDateString()}</h3>
                      <h3 className="text-md font-semibold text-center text-gray-800 flex items-center justify-center gap-1">
                        💵 Cash Sales: {item.reports.cashsales}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ReportFile */}
        <div className="mb-10 p-6  rounded-lg shadow-md">
          {/* Heading */}
          <div className="flex items-center justify-center">
            <h2 className="text-3xl font-bold mb-4 mt-8 text-blue-700">
              📊 Report File
            </h2>
            <img
              src={add}
              alt="Create"
              width={50}
              className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
              onClick={() => navigate("/reportfile")}
            /></div>

          {/* Report List */}
          {reportfile.length > 0 ? (
            <div className="flex space-x-4 justify-center overflow-x-auto pb-3 scrollbar-hide">
              {reportfile.slice(0, 4).map((report) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/reportfile/${report._id}`)}
                  className="min-w-[200px] p-4 border rounded-xl shadow-md bg-white hover:bg-gray-100 cursor-pointer transition duration-300 transform hover:scale-105"
                >
                  <h1 className="text-xl text-green-700 font-bold text-center">
                    {report.department}
                  </h1>
                  <h3 className="text-md font-semibold text-center text-gray-800 mt-2 flex items-center justify-center gap-1">
                    📅 {new Date(report.entryDate).toLocaleDateString()}
                  </h3>
                  <h3 className="text-md font-semibold text-center text-gray-800 mt-2 flex items-center justify-center gap-1">
                    💵 Cash Sales: ₹{report.reports.cashsales}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-4">No reports available.</p>
          )}

          {/* See More Button */}
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
          {/* Modal for Full List */}
          {isOpen3 && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl relative">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen3(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                >
                  <FaTimes className="text-2xl" />
                </button>

                <h2 className="text-xl font-bold text-center mb-4 text-blue-700"> Full Reportfiles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reportfile.map((item) => (
                    <div key={item._id} className="p-4 border rounded-lg bg-gray-100 cursor-pointer transition duration-300 ease-in-out hover:text-lg hover:scale-110" onClick={() => navigate(`/reportfile/${item._id}`)}>
                      <h1 className="text-lg font-bold text-green-700 text-center">₹{item.department}</h1>
                      <h3 className="text-sm text-gray-600 text-center">📅 {new Date(item.entryDate).toLocaleDateString()}</h3>
                      <h3 className="text-md font-semibold text-center text-gray-800 flex items-center justify-center gap-1">
                        💵 Cash Sales: {item.reports.cashsales}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>


        {/* Cashier Kaam */}
        <div className="mb-10 p-6 rounded-lg shadow-md">
          {/* Heading with Button */}
          <div className="flex items-center justify-center">
            <h2 className="text-3xl font-bold mb-4 mt-8 text-blue-700">💰 Cashier Kaam</h2>
            <img
              src={add}
              alt="Create"
              width={50}
              className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
              onClick={() => navigate("/cashier")}
            />
          </div>

          {/* Total Amount */}
          <div className="flex items-center mt-[-50px] mb-[30px] justify-center">
            <span className="text-xl font-bold mb-4 mt-8 text-blue-700">Total Amount: ₹{cashierTotal}</span>
          </div>

          {/* Cashier Records (Horizontal Scroll) */}
          {cashier.length > 0 ? (
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
                    📅 {new Date(item.date).toLocaleDateString()}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-4">No reports available.</p>
          )}

          {/* See More Button */}
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

          {/* Modal for Full List */}
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl relative">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                >
                  <FaTimes className="text-2xl" />
                </button>

                <h2 className="text-xl font-bold text-center mb-4 text-blue-700">💰 Full Cashier Report</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cashier.map((item) => (
                    <div key={item._id} className="p-4 border rounded-lg bg-gray-100 cursor-pointer transition duration-300 ease-in-out hover:text-lg hover:scale-110">
                      <h1 className="text-lg font-bold text-green-700 text-center">₹{item.amount}</h1>
                      <h3 className="text-md font-semibold text-center text-gray-800 flex items-center justify-center gap-1">
                        <FaUniversity className="text-blue-600" /> {item.bank}
                      </h3>
                      <h3 className="text-sm text-gray-600 text-center">📅 {new Date(item.date).toLocaleDateString()}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Complaints Section */}
        <div className="mb-10 p-6 rounded-lg shadow-md">
          {/* Heading */}
          <div className="flex items-center justify-center">
            <h2 className="text-3xl font-bold mb-4 mt-8 text-blue-700">🚨 Complaints</h2>
            <img
              src={add}
              alt="Create"
              width={50}
              className="ml-4 cursor-pointer transform transition hover:scale-110 hover:rotate-12"
              onClick={() => setShowModal2(true)}
            />
          </div>

          {/* Complaints List */}
          {reports.length > 0 ? (
            <div className="flex space-x-4 justify-center overflow-x-auto pb-3 scrollbar-hide">
              {reports.slice(0, 4).map((report) => (
                <div
                  key={report._id}
                  className="min-w-[200px] p-4 border rounded-xl shadow-md bg-white hover:bg-gray-100 cursor-pointer transition duration-300 transform hover:scale-105"
                >
                  <h3 className="text-xl text-green-700 font-bold text-center">{report.title}</h3>
                  <p className="text-md font-semibold text-center text-gray-800 mt-2 flex items-center justify-center gap-1">
                    📂 {report.department}
                  </p>
                  <p className="mt-3 text-gray-800 text-center line-clamp-2">{report.content}</p>
                  <div className="flex justify-center mt-3">
                    <button
                      onClick={() => handleDeleteReport(report._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4 italic">No complaints available.</p>
          )}

          {/* See More Button */}
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
              <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl relative">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen2(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                >
                  <FaTimes className="text-2xl" />
                </button>

                <h2 className="text-xl font-bold text-center mb-4 text-blue-700">💰 Full Complaints Report</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reports.map((item) => (
                    <div key={item._id} className="p-4 border rounded-lg bg-gray-100 cursor-pointer transition duration-300 ease-in-out hover:text-lg hover:scale-110">
                      <h1 className="text-lg font-bold text-green-700 text-center">{item.title}</h1>
                      <h3 className="text-md font-semibold text-center text-gray-800 flex items-center justify-center gap-1">
                        {item.department}
                      </h3>
                      <div className="flex justify-center mt-3">
                        <button
                          onClick={() => handleDeleteReport(item._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center gap-2"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Floating Buttons & Navigation */}
        <div className="relative flex flex-col items-center mt-6">
          {/* Floating Action Buttons */}
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
        {/* Profile Modal */}
        {showProfileModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            role="dialog"
            aria-labelledby="profile-modal-title"
          >
            {/* Modal Box */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md relative">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowProfileModal(false)}
                aria-label="Close"
              >
                ❌
              </button>

              <h2
                id="profile-modal-title"
                className="text-2xl font-bold mb-4 text-center text-blue-600"
              >
                Profile
              </h2>

              <form>
                {[
                  { label: "Name", value: updatedProfile.username, key: "username", editable: true },
                  { label: "Email", value: updatedProfile.email, key: "email", editable: false },
                  { label: "Role", value: updatedProfile.department, key: "department", editable: false },
                ].map(({ label, value, key, editable }) => (
                  <div key={key} className="mb-4">
                    <label className="block text-gray-700 font-semibold">{label}:</label>
                    {editable ? (
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={value || ""}
                        onChange={(e) =>
                          setUpdatedProfile({ ...updatedProfile, [key]: e.target.value })
                        }
                      />
                    ) : (
                      <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100">
                        {value || "N/A"}
                      </p>
                    )}
                  </div>
                ))}

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 hover:bg-gray-400 transition"
                    onClick={() => setShowProfileModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={handleProfileSave}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Edit Modal */}
        {isEditing && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            role="dialog"
            aria-labelledby="edit-report-modal-title"
          >
            {/* Modal Box */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md relative">
              {/* Close Button */}

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
        {/* Modal for Selecting Department of complaint report */}
        {showModal2 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            role="dialog"
            aria-labelledby="department-modal-title"
            onClick={(e) => e.target.id === "modal-overlay" && setShowModal2(false)}
          >
            {/* Modal Box */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md relative">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal2(false)}
                aria-label="Close"
              >
                ❌
              </button>

              <h2
                id="department-modal-title"
                className="text-2xl font-bold mb-4 text-center text-blue-600"
              >
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
      </div>
    </>
  );
};
export default Dashboard;