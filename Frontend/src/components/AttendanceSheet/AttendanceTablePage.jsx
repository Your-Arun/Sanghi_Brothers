import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../Dashboard/axiosInstance";
import { 
  FaCalendarAlt, 
  FaSyncAlt, 
  FaSortAmountDown, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationCircle,
  FaUserClock
} from "react-icons/fa";

const AttendanceTablePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("a-z");

  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();
  const daysInMonth = new Date(year, month, 0).getDate();

  const fetchMonthlyAttendance = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/monthly-attendance?month=${String(month).padStart(2, "0")}&year=${year}`
      );
      setAttendanceData(res.data || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [selectedDate]);

  const sortAttendanceData = (data) => {
    if (sortOption === "a-z") {
      return [...data].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "z-a") {
      return [...data].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "recent") {
      return [...data].sort((a, b) => (b._id > a._id ? 1 : -1));
    }
    return data;
  };

  const sortedData = sortAttendanceData(attendanceData);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6">
      
      {/* --- HEADER & TOOLBAR --- */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                <FaUserClock size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Monthly Logs</h1>
                <p className="text-sm text-gray-500">
                    Viewing data for {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
                </p>
            </div>
        </div>

        {/* Toolbar Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Left: Date Picker */}
          <div className="relative w-full md:w-auto z-20">
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="w-full md:w-48 pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-gray-700"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative w-full md:w-40">
                <FaSortAmountDown className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer"
                >
                    <option value="a-z">Name (A-Z)</option>
                    <option value="z-a">Name (Z-A)</option>
                    <option value="recent">Recent</option>
                </select>
            </div>

            <button
                onClick={fetchMonthlyAttendance}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md whitespace-nowrap"
            >
                <FaSyncAlt className={loading ? "animate-spin" : ""} /> 
                <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 w-fit">
          <div className="flex items-center gap-1.5">
            <FaCheckCircle className="text-green-500 text-sm" /> Present
          </div>
          <div className="flex items-center gap-1.5">
            <FaExclamationCircle className="text-yellow-500 text-sm" /> Leave
          </div>
          <div className="flex items-center gap-1.5">
            <FaTimesCircle className="text-red-400 text-sm" /> Absent
          </div>
        </div>
      </div>

    {/* --- TABLE SECTION --- */}
<div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
  
  {/* Wrapper for scrolling */}
  <div className="overflow-x-auto pb-2 custom-scrollbar">
    
    {loading ? (
      <div className="text-center py-20 flex flex-col items-center text-gray-500">
        <FaSyncAlt className="animate-spin text-3xl mb-3 text-indigo-500" />
        <span className="text-sm font-medium">Loading attendance records...</span>
      </div>
    ) : attendanceData.length === 0 ? (
      <div className="text-center py-20 text-gray-400 bg-gray-50">
        <p className="text-lg font-medium">No records found for this month.</p>
      </div>
    ) : (
      /* min-w-max forces the table to be wide enough, enabling scroll */
      <table className="w-full min-w-max border-collapse text-sm text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider font-semibold border-b border-gray-200">
            
            {/* Sticky Name Header */}
            <th className="px-6 py-4 sticky left-0 z-20 bg-gray-50 border-r border-gray-200 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)] min-w-[200px]">
              Employee
            </th>

            {/* Date Headers */}
            {Array.from({ length: daysInMonth }, (_, i) => (
              <th key={i} className="px-2 py-4 text-center min-w-[40px] border-r border-gray-100 last:border-r-0">
                {i + 1}
              </th>
            ))}

            {/* Total Header */}
            <th className="px-6 py-4 text-center bg-indigo-50 text-indigo-700 border-l border-gray-200 min-w-[100px]">
              Total
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {sortedData.map((user, idx) => {
            let totalPresent = 0;

            return (
              <tr 
                key={idx} 
                className="group hover:bg-blue-50/50 transition-colors duration-200"
              >
                {/* Sticky Name Column */}
                <td className="px-6 py-3 font-medium text-gray-800 border-r border-gray-200 sticky left-0 z-10 bg-white group-hover:bg-blue-50/50 transition-colors duration-200 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)] whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {/* User Avatar Circle */}
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold uppercase overflow-hidden">
                       {user.photo ? (
                         <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                       ) : (
                         user.name.charAt(0)
                       )}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </td>

                {/* Date Columns */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const date = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                  const status = user.attendance[date];

                  if (status === "Present") totalPresent++;

                  return (
                    <td key={i} className="px-1 py-3 text-center border-r border-gray-50 last:border-r-0">
                      <div className="flex justify-center items-center h-full">
                        {status === "Present" ? (
                          <FaCheckCircle className="text-green-500 text-lg drop-shadow-sm" title="Present" />
                        ) : status === "Leave" ? (
                          <FaExclamationCircle className="text-yellow-500 text-lg drop-shadow-sm" title="Leave" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-200" title="Absent/No Data"></div>
                        )}
                      </div>
                    </td>
                  );
                })}

                {/* Total Count Column */}
                <td className="px-6 py-3 text-center font-bold text-indigo-700 bg-indigo-50/30 border-l border-gray-200 group-hover:bg-indigo-100/50 transition-colors">
                  {totalPresent}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
</div>
    </div>
  );
};

export default AttendanceTablePage;