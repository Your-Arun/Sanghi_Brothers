import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import UserContext from "../Home Page/UserContext"; // Import User Context
import { toast } from 'react-toastify'

const DepartmentReports = () => {
  const { user } = useContext(UserContext); // Get logged-in user from context
  const [reports, setReports] = useState([]);
  const [reportFile, setReportFile] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.warning("You are not authorized. Please login first.");
      navigate("/login");
      return;
    }

    const token = sessionStorage.getItem("authToken"); // ✅ Use sessionStorage
    const userDepartment = user.department.toLowerCase(); // ✅ Get department from session

    const fetchData = async () => {
      try {
        const [reportsResponse, reportFilesResponse] = await Promise.all([
          axiosInstance.get("/reports", {
           
          }),
          axiosInstance.get("/reportfile", {
           
          }),
        ]);

        // ✅ Manager sees all reports, others see only their department's reports
        if (userDepartment === "manager") {
          setReports(reportsResponse.data);
          setReportFile(reportFilesResponse.data);
        } else {
          setReports(
            reportsResponse.data.filter(
              (report) => report.department.toLowerCase() === userDepartment
            )
          );
          setReportFile(
            reportFilesResponse.data.filter(
              (file) => file.department.toLowerCase() === userDepartment
            )
          );
        }
      } catch (error) {
        toast.warn("Failed to fetch data.");
      }
    };

    fetchData();
  }, [user, navigate]);

  return (
    <div className="flex flex-col  bg-gradient-to-r from-blue-400 to-yellow-400 items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-teal-700 text-white py-6 text-center shadow-lg">
        {user && (
          <h2 className="text-3xl font-semibold">
            Welcome, <span className="text-yellow-300">{user.username.toUpperCase()}!</span>
          </h2>
        )}
        <h1 className="text-xl mt-2">Department: {user?.department.toUpperCase()}</h1>
      </div>

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