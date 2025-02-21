import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import add from "/public/add.png";

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
  const viewReports = (department) => {
    const userDepartment = localStorage.getItem("userDepartment"); // Assuming this is set during login
    if (userDepartment !== department) {
      alert("You can only view reports for your own department.");
      return;
    }
    navigate(`/department-reports?department=${department}`);
  };
  const openReportPage = () => {
    if (selectedDepartment) {
      navigate(`/report?department=${selectedDepartment}`);
      setShowModal2(false);
    } else {
      alert("Please select a department!");
    }
  };
  const handleSubmit = () => {
    navigate("/reportfile");
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
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-teal-700">
              🏢 Departments
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {departments.map((dept) => (
                <div
                  key={dept}
                  className="p-6 border bg-yellow-200 rounded-xl shadow-md hover:bg-yellow-300 cursor-pointer transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg"
                  onClick={() => viewReports(dept)}
                >
                  <h3 className="text-xl font-bold text-orange-700 uppercase">
                    {dept}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* SB Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 p-6 bg-blue-50">
          {/* SB Bank Report Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
              🏦 SB Bank Report
            </h2>
            <div className="flex flex-col items-center">
              <Link
                to="/sbbank"
                className="p-6 border bg-green-200 rounded-lg shadow-md hover:bg-green-300 transition-all duration-300 text-center w-full transform hover:scale-105"
              >
                <h3 className="text-xl font-bold text-red-700">📊 Bank Report</h3>
              </Link>
            </div>
          </div>

          {/* Monthly Flow Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700">
              🔄 Monthly Fund Flow
            </h2>
            <div className="flex flex-col items-center">
              <Link
                to="/bank/monthlyfundflow/"
                className="p-6 border bg-purple-200 rounded-lg shadow-md hover:bg-purple-300 transition-all duration-300 text-center w-full transform hover:scale-105"
              >
                <h3 className="text-xl font-bold text-pink-700">
                  📅 Monthly Fund Flow
                </h3>
              </Link>

              {/* Fund Flow Links */}
              <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sb3update.map((fund) => (
                  <Link
                    to={`/bank/monthlyfundflow/${fund._id}`}
                    key={fund._id}
                    className="p-4 border bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300 text-center cursor-pointer transform hover:scale-105"
                  >
                    <h4 className="text-lg font-bold text-gray-800">
                      📆 {new Date(fund.Date)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, "/")}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* SB Master CheckList */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700">
              📋 SB Master CheckList
            </h2>
            <div className="flex flex-col items-center">
              <Link
                to="/mastersheet"
                className="p-6 border bg-green-200 rounded-lg shadow-md hover:bg-green-300 transition-all duration-300 text-center w-full transform hover:scale-105"
              >
                <h3 className="text-xl font-bold text-red-700">
                  ✅ Master CheckList
                </h3>
              </Link>
            </div>
          </div>
        </div>


        {/* ReportFile */}
        <div className="mb-8">
          {/* Heading */}
          <h2 className="text-3xl font-bold mb-6 mt-8 text-center text-blue-700">
            📊 Report File
          </h2>

          {/* Report List */}
          {reportfile.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {reportfile.map((report) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/reportfile/${report._id}`)}
                  className="p-6 border rounded-xl shadow-lg bg-white hover:bg-gray-100 cursor-pointer transition duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <h1 className="text-xl font-bold text-center text-green-700 uppercase">
                    {report.department}
                  </h1>
                  <h3 className="text-lg font-medium text-center text-gray-800 mt-2">
                    📅 {new Date(report.entryDate).toLocaleDateString()}
                  </h3>
                  <h3 className="text-md font-semibold text-center text-red-600 mt-1">
                    💵 Cash Sales: ₹{report.reports.cashsales}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-4">No reports available.</p>
          )}
        </div>


        {/* Cashier Kaam */}
        <div className="mb-8">
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

          {/* Cashier Records */}
          {cashier.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {cashier.map((cashier) => (
                <div
                  key={cashier._id}
                  className="p-6 border rounded-xl shadow-xl bg-white hover:bg-gray-100 cursor-pointer transition duration-300 transform hover:scale-105"
                >
                  <h1 className="text-2xl text-green-700 font-bold text-center">
                    ₹{cashier.amount}
                  </h1>
                  <h3 className="text-lg font-semibold text-center text-gray-800 mt-2">
                    🏦 {cashier.bank}
                  </h3>
                  <h3 className="text-sm text-gray-600 text-center mt-1">
                    📅 {new Date(cashier.date).toLocaleDateString()}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-4">No reports available.</p>
          )}
        </div>

        {/* Complaints Section */}
        <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-md">
          {/* Heading */}
          <h2 className="text-3xl font-extrabold mb-6 text-center text-red-700">
            🚨 Complaints
          </h2>

          {/* Complaints List */}
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="p-6 border border-gray-300 bg-white rounded-xl shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
                  onClick={() => handleReportClick(report)} // Open edit modal
                >
                  <h3 className="font-bold text-lg text-blue-600 text-center">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-center font-semibold mt-1">
                    📂 {report.department}
                  </p>
                  <p className="mt-3 text-gray-800 text-center line-clamp-2">
                    {report.content}
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


        {/* Floating Action & Navigation Buttons */}
<div className="relative flex flex-col items-center mt-6">
  {/* Floating Buttons */}
  <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-center space-y-4 md:space-x-6 md:space-y-0 w-full max-w-3xl">
    <button
      onClick={() => setShowModal2(true)}
      className="bg-red-500 text-white flex items-center px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition-all w-full md:w-auto"
      aria-label="Create Report"
    >
      📝 <span className="ml-2">Create Complaint</span>
    </button>

    <button
      onClick={handleSubmit}
      className="bg-orange-500 text-white flex items-center px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition-all w-full md:w-auto"
      aria-label="Report File"
    >
      📄 <span className="ml-2">Report File</span>
    </button>

    <button
      className="bg-blue-500 text-white flex items-center px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all w-full md:w-auto"
      aria-label="Upload File"
      onClick={() => navigate("/exceluploader")}
    >
      📤 <span className="ml-2">Upload File</span>
    </button>
  </div>

  {/* Navigation Buttons */}
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
    <a href="/shifting" className="w-full">
      <button className="bg-green-500 text-white w-full flex items-center justify-center px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all">
        SHIFTING
      </button>
    </a>

    <a href="/lekhajokha" className="w-full">
      <button className="bg-green-500 text-white w-full flex items-center justify-center px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all">
        LEKHA JOKHA
      </button>
    </a>

    <a href="/createmeterclose" className="w-full">
      <button className="bg-green-500 text-white w-full flex items-center justify-center px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all">
        METER CLOSE
      </button>
    </a>
  </div>
</div>



        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
                Profile
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={updatedProfile.username || ""}
                    onChange={(e) =>
                      setUpdatedProfile({
                        ...updatedProfile,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={updatedProfile.email || ""}
                    onChange={(e) =>
                      setUpdatedProfile({
                        ...updatedProfile,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    Department:
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={updatedProfile.department || ""}
                    onChange={(e) =>
                      setUpdatedProfile({
                        ...updatedProfile,
                        department: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 transition duration-300 hover:bg-gray-400"
                    onClick={() => setShowProfileModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg transition duration-300 hover:bg-blue-600"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
                Edit Report
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    Title:
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={updatedTitle}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    Content:
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="6"
                    value={updatedContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 transition duration-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateReport}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg transition duration-300 hover:bg-blue-600"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
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
                  onClick={() => setShowModal2(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2 transition duration-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={openReportPage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg transition duration-300 hover:bg-blue-600"
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