import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const DepartmentReports = () => {
  const [reports, setReports] = useState([]);
  const location = useLocation();
  const department = new URLSearchParams(location.search).get("department");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const userDepartment = localStorage.getItem("userDepartment");

        if (userDepartment !== department) {
          alert("You are not authorized to view reports for this department.");
          return;
        }

        const { data } = await axios.get(
          `http://localhost:5500/reports?department=${department}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReports(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch reports.");
      }
    };

    fetchReports();
  }, [department]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reports for {department}</h1>
      {reports.length === 0 ? (
        <p>No reports submitted for this department yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <div
              key={report._id}
              className="p-4 border rounded shadow bg-white"
            >
              <h2 className="font-bold text-lg mb-2">{report.title}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {new Date(report.createdAt).toLocaleString()}
              </p>
              <p>{report.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentReports;
