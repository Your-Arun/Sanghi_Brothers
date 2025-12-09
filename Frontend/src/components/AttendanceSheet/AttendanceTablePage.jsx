import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../Dashboard/axiosInstance";
import { 
  FaCalendarAlt, 
  FaSyncAlt, 
  FaSortAmountDown, 
  FaCheck, 
  FaTimes, 
  FaExclamation,
  FaUserTie
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

  // Sorting Logic
  const sortedData = [...attendanceData].sort((a, b) => {
    if (sortOption === "a-z") return a.name.localeCompare(b.name);
    if (sortOption === "z-a") return b.name.localeCompare(a.name);
    return 0; // Default
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaUserTie className="text-indigo-600" /> 
            Attendance Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* Date Picker */}
          <div className="relative flex-1 lg:flex-none">
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="w-full lg:w-48 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700 cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 lg:flex-none">
            <FaSortAmountDown className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full lg:w-40 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer"
            >
              <option value="a-z">Name (A-Z)</option>
              <option value="z-a">Name (Z-A)</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchMonthlyAttendance}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* --- CONTENT GRID (No Horizontal Scroll) --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
           <FaSyncAlt className="animate-spin text-3xl mb-3 text-indigo-400" />
           <p>Loading attendance data...</p>
        </div>
      ) : attendanceData.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
           <p className="text-gray-400 text-lg">No records found for this month.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedData.map((user) => {
            // Calculate stats for this user
            let presentCount = 0;
            let leaveCount = 0;
            let absentCount = 0;

            const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
                const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                const status = user.attendance[dateKey];
                
                if (status === "Present") presentCount++;
                else if (status === "Leave") leaveCount++;
                else absentCount++;

                return { day: i + 1, status };
            });

            return (
              <div 
                key={user._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* User Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.photo || "/user.png"} 
                      alt={user.name}
                      onError={(e) => { e.target.src = "/user.png"; }}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md bg-gray-100"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">{user.name}</h3>
                      <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                        {user.department || "Employee"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-indigo-600">{presentCount}</span>
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Days Present</span>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {/* Days Header */}
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                        <div key={i} className="text-center text-[10px] font-bold text-gray-400">{d}</div>
                    ))}
                    
                    {/* Days Body */}
                    {daysArray.map(({ day, status }) => {
                        let bgClass = "bg-gray-100 text-gray-300"; // Absent/Null
                        let icon = null;

                        if (status === "Present") {
                            bgClass = "bg-green-100 text-green-600 border border-green-200";
                            icon = <FaCheck size={8} />;
                        } else if (status === "Leave") {
                            bgClass = "bg-yellow-100 text-yellow-600 border border-yellow-200";
                            icon = <FaExclamation size={8} />;
                        } else {
                             // Absent logic
                             bgClass = "bg-red-50 text-red-300 border border-red-100";
                             icon = <FaTimes size={8} />;
                        }

                        return (
                            <div 
                                key={day} 
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all ${bgClass}`}
                                title={`Day ${day}: ${status || 'Absent'}`}
                            >
                                <span>{day}</span>
                                {status === "Present" && <div className="w-1 h-1 bg-green-500 rounded-full mt-0.5"></div>}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Stats */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Present
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Leave ({leaveCount})
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div> Absent
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceTablePage;