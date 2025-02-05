import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [sb3update, setSb3Update] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Simulate file upload (replace with your actual upload logic)
    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("File uploaded successfully!");
          setFile(null); // Reset the file input after successful upload
        } else {
          alert("File upload failed.");
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("An error occurred while uploading the file.");
      });
  };
  const openFileDialog = () => {
    fileInputRef.current.click(); // Programmatically click the file input
  };

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
      <div className="relative p-6 dashboard bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mt-[-20px] font-serif uppercase mb-6 text-center text-blue-600">
          Dashboard
        </h1>

        <div className="relative mb-4">
          <div className="flex items-center  mt-[-60px] justify-end">
            <img
              src="public/user.png"
              alt="User "
              className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <button
                className="block px-4 py-2 text-left w-full text-red-500 hover:bg-gray-100"
                onClick={() => {
                  fetchProfile();
                  setShowProfileModal(true);
                  setShowUserMenu(false);
                }}
              >
                Profile
              </button>
              <button
                className="block px-4 py-2 text-left w-full text-red-500 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <div>
          {/* Departments Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              Departments
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {departments.map((dept) => (
                <div
                  key={dept}
                  className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 cursor-pointer text-center"
                  onClick={() => viewReports(dept)}
                >
                  <h3 className="text-xl font-bold text-white">
                    {dept.toUpperCase()}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* SB Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 p-6 bg-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              SB Bank Report
            </h2>
            <div className="flex flex-col items-center">
              <Link
                to="/sbbank"
                className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
              >
                <h3 className="text-xl font-bold text-white ">Bank Report</h3>
              </Link>
            </div>
          </div>
          {/* Monthly Flow Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              Monthly Fund Flow
            </h2>
            <div className="flex flex-col items-center">
              <Link
                to="/bank/monthlyfundflow/"
                className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
              >
                <h3 className="text-xl font-bold text-white">
                  Monthly Fund Flow
                </h3>
              </Link>

              <div className="grid mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sb3update.map((fund) => (
                  <Link
                    to={`/bank/monthlyfundflow/${fund._id}`}
                    key={fund._id} // Ensure you use a unique identifier
                    className="p-4 border bg-slate-300 rounded-lg shadow-md hover:bg-blue-200 transition duration-300 text-center cursor-pointer"
                  >
                    <h4 className="text-lg font-bold">
                      {new Date(fund.Date)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, "/")}
                    </h4>{" "}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
              SB Master CheckList
            </h2>
            <div className="flex flex-col items-center">
              <Link
                to="/mastersheet"
                className="p-6 border bg-slate-400 rounded-lg shadow-lg hover:bg-blue-300 transition duration-300 text-center w-full"
              >
                <h3 className="text-xl font-bold text-white">
                  Master CheckList
                </h3>
              </Link>
            </div>
          </div>
        </div>

        {/* ReportFile */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 mt-8 text-center text-blue-600">
            Report File
          </h2>
          {reportfile.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
              {reportfile.map((reportfile) => (
                <div
                  key={reportfile._id}
                  onClick={() => navigate(`/reportfile/${reportfile._id}`)}
                  className="p-6 border rounded-lg shadow-lg bg-slate-300 hover:bg-blue-400 cursor-pointer transition duration-300"
                >
                  <h1 className="text-xl text-brown-600 text-center font-bold">
                    {reportfile.department.toUpperCase()}
                  </h1>
                  <h3 className="text-lg font-serif text-center text-gray-700">
                    {new Date(reportfile.entryDate).toLocaleDateString()}
                  </h3>
                  <h3 className="text-sm text-red-700 text-center">
                    Cash Sales: {reportfile.reports.cashsales}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No reports available.</p>
          )}
        </div>

        {/* Complaints Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 mt-10 text-center text-blue-600">
            Complaints
          </h2>
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="p-6 border bg-slate-300 rounded-lg shadow-lg hover:bg-blue-200 cursor-pointer transition duration-300"
                  onClick={() => handleReportClick(report)} // Open edit modal
                >
                  <h3 className="font-bold text-lg text-brown-600">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600">{report.department}</p>
                  <p className="mt-2 text-gray-800">{report.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No reports available.</p>
          )}
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

        {/* Floating Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mt-6">
          {/* Create Complaint Button */}
          <button
            onClick={() => setShowModal2(true)}
            className="bg-blue-500 text-white rounded-lg p-4 shadow-lg hover:bg-blue-600 transition duration-300 flex items-center"
            aria-label="Create Report"
          >
            <span className="mr-2">📝</span>{" "}
            {/* Optional icon for visual appeal */}
            Create Complaint
          </button>

          {/* Report File Button */}
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded-lg p-4 shadow-lg hover:bg-blue-600 transition duration-300 flex items-center"
            aria-label="Report File"
          >
            <span className="mr-2">📄</span>{" "}
            {/* Optional icon for visual appeal */}
            Report File
          </button>

          {/* Upload File Section */}
          <div className="flex items-center">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.xls,.xlsx"
              onChange={handleFileChange}
              className="mr-2 w-full hidden" // Hide the input but keep it accessible
              ref={fileInputRef} // Attach the ref to the input
            />
            <button
              className="bg-blue-500 text-white rounded-lg p-4 shadow-lg hover:bg-blue-600 transition duration-300 flex items-center"
              aria-label="Upload File"
              onClick={openFileDialog} // Open file dialog on button click
            >
              <span className="mr-2">📤</span>{" "}
              {/* Optional icon for visual appeal */}
              Upload File
            </button>
            <button
              className="bg-green-500 text-white rounded-lg p-4 shadow-lg hover:bg-green-600 transition duration-300 flex items-center ml-2"
              aria-label="Submit File"
              onClick={handleUpload} // Submit the file
            >
              <span className="mr-2">✅</span>{" "}
              {/* Optional icon for visual appeal */}
              Submit
            </button>
          </div>

          <div className="flex justify-between">
          <div>
            <a href="/shifting"><button className="bg-green-500 text-white rounded-lg p-4 shadow-lg hover:bg-green-600 transition duration-300 flex items-center ml-2">
              Shifting
            </button></a>
          </div>
          <div>
            <a href="/lekhajokha"><button className="bg-green-500 text-white rounded-lg p-4 shadow-lg hover:bg-green-600 transition duration-300 flex items-center ml-2">
              Lekha Jokha
            </button></a>
          </div>
          </div>
        </div>
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
