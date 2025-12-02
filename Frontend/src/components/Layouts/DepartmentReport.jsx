import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../Dashboard/axiosInstance'
import UserContext from "../Home Page/UserContext"; // Import User Context
import { toast } from 'react-toastify'
import { 
  FaArrowLeft, 
  FaFileInvoiceDollar, 
  FaExclamationTriangle, 
  FaCalendarAlt, 
  FaBuilding,
  FaSearch
} from "react-icons/fa";

const DepartmentReports = () => {
  const { user } = useContext(UserContext); // Get logged-in user from context
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportFile, setReportFile] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.warning("You are not authorized. Please login first.");
      navigate("/login");
      return;
    }

    const userDepartment = user.department.toLowerCase();

    const fetchData = async () => {
      try {
        const [reportsResponse, reportFilesResponse] = await Promise.all([
          axiosInstance.get("/reports"),
          axiosInstance.get("/reportfile"),
        ]);

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  // Handle unauthorized access or loading
  if (loading && user) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading data...</div>;
  if (!user) {
      navigate("/login");
      return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
    {/* --- Header --- */}
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            Department Reports
          </h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{user.username}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{user.department}</p>
           </div>
           <div className="h-10 w-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
              {user.username.charAt(0).toUpperCase()}
           </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* --- SECTION 1: REPORT FILES --- */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <FaFileInvoiceDollar className="text-teal-600 text-xl" />
          <h2 className="text-2xl font-bold text-gray-800">Financial Reports</h2>
          <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">
            {reportFile.length} Files
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reportFile.length > 0 ? (
            reportFile.map((file) => (
              <Link 
                key={file._id} 
                to={`/reportfile/${file._id}`}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-teal-300 transition-all duration-200 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <FaFileInvoiceDollar size={20} />
                    </div>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {file.department}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {new Date(file.entryDate).toLocaleDateString('en-GB')}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {file.content || "No description available."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-2">
                     <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Cash Sales</p>
                     <p className="text-xl font-bold text-teal-700">₹{file.reports.cashsales}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
              <FaSearch className="mx-auto text-3xl mb-3 text-gray-300" />
              <p>No financial reports found for this department.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- SECTION 2: COMPLAINTS --- */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <FaExclamationTriangle className="text-red-500 text-xl" />
          <h2 className="text-2xl font-bold text-gray-800">Complaints & Issues</h2>
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">
            {reports.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div 
                key={report._id} 
                className="bg-white rounded-xl shadow-sm border border-red-100 p-5 hover:shadow-md transition-all duration-200 h-full flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                
                <div className="flex justify-between items-start mb-3 pl-2">
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{report.title}</h3>
                  <FaExclamationTriangle className="text-red-400 flex-shrink-0 ml-2" />
                </div>

                <div className="pl-2 flex-1">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {report.content}
                  </p>
                </div>

                <div className="pl-2 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaBuilding /> {report.department}
                  </span>
                  {/* If you have a date in reports, display it here */}
                  {report.createdAt && (
                    <span className="flex items-center gap-1">
                       <FaCalendarAlt /> {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
               <p>No active complaints for this department. ✅</p>
            </div>
          )}
        </div>
      </div>

    </div>
  </div>
  );
};

export default DepartmentReports;