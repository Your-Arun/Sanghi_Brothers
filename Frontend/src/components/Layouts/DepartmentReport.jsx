import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const DepartmentReports = () => {
  const [reports, setReports] = useState([]);
  const [userName, setUserName] = useState("");
  const [reportFile, setReportFile] = useState([]);
  const [userDepartment, setUserDepartment] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const department = query.get("department");




  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole"); // Get user role
    const userDept = localStorage.getItem("userDepartment"); // Get logged-in user's department
  
    if (!token) {
      alert("You are not authorized. Please login first.");
      navigate("/login");
      return;
    }
  
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
  
        const deptToUse = userRole === "manager" ? null : userDept; // Manager sees all
  
        setReports(
          deptToUse
            ? reportsResponse.data.filter((report) => report.department === deptToUse)
            : reportsResponse.data
        );
  
        setReportFile(
          deptToUse
            ? reportFilesResponse.data.filter((file) => file.department === deptToUse)
            : reportFilesResponse.data
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data.");
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please login first.");
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5500/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserName(response.data.username);
        setUserDepartment(response.data.department);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Failed to fetch user profile.");
      }
    };

    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5500/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredReports = response.data.filter(
          (report) => report.department === userDepartment
        );

        setReports(filteredReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        alert("Failed to fetch reports.");
      }
    };

    const fetchReportFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5500/reportfile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredFiles = response.data.filter(
          (file) => file.department === userDepartment
        );

        setReportFile(filteredFiles);
      } catch (error) {
        console.error("Error fetching report files:", error);
        alert("Failed to fetch report files.");
      }
    };

    fetchUserProfile();
    fetchReports();
    fetchReportFiles();
  }, [userDepartment]);



  return (
    <div className="h-[90vh] bg-gray-100 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full bg-teal-700 text-white py-6 text-center shadow-lg">
        {userName && (
          <h2 className="text-3xl font-semibold">
            Welcome, <span className="text-yellow-300">{userName.toLocaleUpperCase()}   !</span>
          </h2>
        )}
        <h1 className="text-xl mt-2">Department: {userDepartment.toLocaleUpperCase()}</h1>
      </div>

      {/* Report Files Section */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-teal-800 mb-4">📂 Report Files</h2>
        <div className="grid gap-6 md:grid-cols-3">
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
        <div className="grid gap-6 md:grid-cols-3">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report._id} className="p-6 border bg-white shadow-md rounded-lg hover:shadow-lg transition transform hover:scale-105">
                <h2 className="font-bold text-red-600">{report.title}</h2>
                <p className="text-gray-600">{report.content}</p>
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
