import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const DepartmentReports = () => {
  const [reports, setReports] = useState([]);
  const [userName, setUserName] = useState("");
  const [reportFile, setReportFile] = useState([]);
  const [userDepartment, setUserDepartment] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const department = localStorage.getItem("userDepartment")?.toLowerCase();

    if (!token) {
      alert("You are not authorized. Please login first.");
      navigate("/login");
      return;
    }
    setUserDepartment(department);

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5500/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(response.data.username);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Failed to fetch user profile.");
      }
    };

    const fetchData = async () => {
      try {
        const [reportsResponse, reportFilesResponse] = await Promise.all([
          axios.get("http://localhost:5500/reports", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5500/reportfile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // ✅ Manager ko saare reports aur files dikhane hain
        if (department === "manager") {
          setReports(reportsResponse.data);
          setReportFile(reportFilesResponse.data);
        } else {
          // ✅ Accounts/Finance wale ko sirf apne department ka dikhana hai
          setReports(
            reportsResponse.data.filter((report) => report.department.toLowerCase() === department)
          );
          setReportFile(
            reportFilesResponse.data.filter((file) => file.department.toLowerCase() === department)
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data.");
      }
    };

    fetchUserProfile();
    fetchData();
  }, []);

  return (
    <div className="h-screen-min bg-gray-100 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full bg-teal-700 text-white py-6 text-center shadow-lg">
        {userName && (
          <h2 className="text-3xl font-semibold">
            Welcome, <span className="text-yellow-300">{userName.toUpperCase()}!</span>
          </h2>
        )}
        <h1 className="text-xl mt-2">Department: {userDepartment.toUpperCase()}</h1>
      </div>

      {/* Report Files Section */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-teal-800 mb-4">📂 Report Files</h2>
        <div className="grid gap-6 md:grid-cols-5">
          {reportFile.length > 0 ? (
            reportFile.map((file) => (
              <Link key={file._id} to={`/reportfile/${file._id}`}>
                <div className="p-6 border bg-white shadow-md rounded-lg hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
                  <h2 className="font-bold text-teal-700">
                    {file.entryDate.split("T")[0]}
                  </h2>
                  <p className="text-gray-700">
                    Cash Sales: <span className="font-bold">{file.reports.cashsales}</span>
                  </p>
                  <p className="text-gray-500">{file.content}</p>
                  <p className="text-gray-500">{file.department}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No report files available.</p>
          )}
        </div>
      </div>

      {/* Complaints Section */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">⚠️ Complaints</h2>
        <div className="grid gap-6 md:grid-cols-5">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report._id} className="p-6 border bg-white shadow-md rounded-lg hover:shadow-lg transition transform hover:scale-105">
                <h2 className="font-bold text-red-600">{report.title}</h2>
                <p className="text-gray-600">{report.content}</p>
                <p className="text-gray-600">{report.department}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reports available for this department.</p>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="my-6">
        <Link to="/dashboard">
          <button className="flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition">
            🔙 Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DepartmentReports;
