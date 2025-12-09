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
    <div className="min-h-screen bg-gray-900 font-sans p-4 sm:p-6 text-gray-100">
      
      {/* --- HEADER & TOOLBAR --- */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-900/30 rounded-lg text-blue-400 border border-blue-800">
                <FaUserClock size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-white">Monthly Logs</h1>
                <p className="text-sm text-gray-400">
                    Viewing data for {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
                </p>
            </div>
        </div>

        {/* Toolbar Card */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Left: Date Picker */}
          <div className="relative w-full md:w-auto z-20">
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="w-full md:w-48 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium text-white placeholder-gray-400"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative w-full md:w-40">
                <FaSortAmountDown className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer text-white"
                >
                    <option value="a-z">Name (A-Z)</option>
                    <option value="z-a">Name (Z-A)</option>
                    <option value="recent">Recent</option>
                </select>
            </div>

            <button
                onClick={fetchMonthlyAttendance}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md whitespace-nowrap font-medium"
            >
                <FaSyncAlt className={loading ? "animate-spin" : ""} /> 
                <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-300 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-fit">
          <div className="flex items-center gap-1.5">
            <FaCheckCircle className="text-green-400 text-sm" /> Present
          </div>
          <div className="flex items-center gap-1.5">
            <FaExclamationCircle className="text-yellow-400 text-sm" /> Leave
          </div>
          <div className="flex items-center gap-1.5">
            <FaTimesCircle className="text-red-400 text-sm" /> Absent
          </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        
        {/* 'overflow-x-auto' enables scrolling, 'pb-4' gives space for scrollbar */}
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            
            {loading ? (
                <div className="text-center py-20 flex flex-col items-center text-gray-400">
                    <FaSyncAlt className="animate-spin text-3xl mb-3 text-blue-500" />
                    Loading attendance records...
                </div>
            ) : attendanceData.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg">No records found for this month.</p>
                </div>
            ) : (
                /* 'min-w-max' forces the table to expand, triggering scroll */
                <table className="min-w-max w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-900 text-gray-400 uppercase text-xs tracking-wider">
                            {/* Sticky Name Header */}
                            <th className="px-4 py-4 text-left font-bold border-b border-r border-gray-700 sticky left-0 bg-gray-900 z-20 shadow-lg min-w-[220px]">
                                Employees
                            </th>
                            
                            {/* Date Headers */}
                            {Array.from({ length: daysInMonth }, (_, i) => (
                                <th key={i} className="px-1 py-3 text-center font-semibold border-b border-gray-700 min-w-[40px]">
                                    {i + 1}
                                </th>
                            ))}
                            
                            {/* Total Header */}
                            <th className="px-4 py-3 text-center font-bold border-b border-l border-gray-700 bg-blue-900/20 text-blue-300 min-w-[100px]">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {sortedData.map((user, idx) => {
                            let totalPresent = 0;

                            return (
                                <tr key={idx} className="group hover:bg-gray-700/50 transition-colors duration-150">
                                    
                                    {/* Sticky Name Column - Logic to match row background on hover */}
                                    <td className="px-4 py-3 text-gray-200 font-medium border-r border-gray-700 sticky left-0 bg-gray-800 z-10 group-hover:bg-gray-700/50 transition-colors duration-150 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={user.photo || "/user.png"} 
                                                alt={user.name} 
                                                className="w-8 h-8 rounded-full object-cover border border-gray-600 bg-gray-700"
                                                onError={(e) => { e.target.src = "/user.png"; }}
                                            />
                                            <span>{user.name}</span>
                                        </div>
                                    </td>

                                    {/* Date Columns */}
                                    {Array.from({ length: daysInMonth }, (_, i) => {
                                        const date = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                                        const status = user.attendance[date];
                                        
                                        if (status === "Present") totalPresent++;

                                        return (
                                            <td key={i} className="px-1 py-2 text-center border-gray-700">
                                                <div className="flex justify-center">
                                                    {status === "Present" ? (
                                                        <FaCheckCircle className="text-green-400 text-lg" title="Present" />
                                                    ) : status === "Leave" ? (
                                                        <FaExclamationCircle className="text-yellow-400 text-lg" title="Leave" />
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-700" title="Absent/No Data"></div>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}

                                    {/* Total Count Column */}
                                    <td className="px-4 py-3 text-center font-bold text-blue-300 bg-blue-900/10 border-l border-gray-700">
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