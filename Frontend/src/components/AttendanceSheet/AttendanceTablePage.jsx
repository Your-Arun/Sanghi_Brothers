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
  FaClock, 
  FaUserTie,
  FaFilter
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
    if (sortOption === "a-z") return [...data].sort((a, b) => a.name.localeCompare(b.name));
    if (sortOption === "z-a") return [...data].sort((a, b) => b.name.localeCompare(a.name));
    if (sortOption === "recent") return [...data].sort((a, b) => (b._id > a._id ? 1 : -1));
    return data;
  };

  const sortedData = sortAttendanceData(attendanceData);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 text-slate-800">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <span className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-200">
                <FaUserTie size={20} />
            </span>
            Attendance Sheet
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Overview for <span className="text-indigo-600">{new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}</span>
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          
          {/* Date Picker */}
          <div className="relative group">
            <FaCalendarAlt className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="pl-10 pr-4 py-2 w-40 bg-slate-50 border-none rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer outline-none transition-all hover:bg-slate-100"
            />
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

          {/* Sort */}
          <div className="relative group">
             <FaFilter className="absolute left-3 top-3 text-slate-400" />
             <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="pl-9 pr-8 py-2 bg-slate-50 border-none rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer outline-none appearance-none hover:bg-slate-100"
             >
                <option value="a-z">A - Z</option>
                <option value="z-a">Z - A</option>
                <option value="recent">Recent</option>
             </select>
             <FaSortAmountDown className="absolute right-3 top-3 text-slate-400 pointer-events-none size-3" />
          </div>

          {/* Refresh */}
          <button
            onClick={fetchMonthlyAttendance}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
            title="Refresh Data"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        
        <div className="overflow-x-auto custom-scrollbar pb-2">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                    <FaSyncAlt className="animate-spin text-4xl mb-4 text-indigo-500" />
                    <span className="font-medium">Loading records...</span>
                </div>
            ) : attendanceData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-slate-50/50">
                    <p className="text-lg font-medium">No records found.</p>
                </div>
            ) : (
                /* 'min-w-max' ensures table takes full width required, enabling scroll */
                <table className="w-full min-w-max border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                            
                            {/* STICKY COLUMN: Employee Name */}
                            <th className="px-6 py-4 text-left sticky left-0 z-20 bg-slate-50 border-r border-slate-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] min-w-[220px]">
                                Employee Details
                            </th>
                            
                            {/* DATE COLUMNS */}
                            {Array.from({ length: daysInMonth }, (_, i) => (
                                <th key={i} className="px-2 py-4 text-center w-[45px] border-r border-slate-100 last:border-none">
                                    {i + 1}
                                </th>
                            ))}
                            
                            {/* TOTAL COLUMN */}
                            <th className="px-6 py-4 text-center bg-indigo-50 text-indigo-700 border-l border-indigo-100 min-w-[100px]">
                                Presents
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {sortedData.map((user, idx) => {
                            let totalPresent = 0;

                            return (
                                <tr key={idx} className="group hover:bg-slate-50/80 transition-colors duration-150">
                                    
                                    {/* STICKY NAME CELL */}
                                    <td className="px-6 py-3 sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-200 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="relative">
                                                <img 
                                                    src={user.photo || "/user.png"} 
                                                    alt={user.name} 
                                                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                                                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user.name + "&background=random"; }} 
                                                />
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                            </div>
                                            <span className="font-semibold text-slate-700 text-sm">{user.name}</span>
                                        </div>
                                    </td>

                                    {/* DATE CELLS */}
                                    {Array.from({ length: daysInMonth }, (_, i) => {
                                        const date = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                                        const status = user.attendance[date];
                                        
                                        if (status === "Present") totalPresent++;

                                        return (
                                            <td key={i} className="px-1 py-3 text-center border-r border-slate-50">
                                                <div className="flex justify-center items-center h-full">
                                                    {status === "Present" ? (
                                                        <div className="w-6 h-6 rounded-md bg-green-100 text-green-600 flex items-center justify-center shadow-sm" title="Present">
                                                            <FaCheck size={10} />
                                                        </div>
                                                    ) : status === "Leave" ? (
                                                        <div className="w-6 h-6 rounded-md bg-yellow-100 text-yellow-600 flex items-center justify-center shadow-sm" title="Leave">
                                                            <FaClock size={10} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" title="Absent"></div>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}

                                    {/* TOTAL CELL */}
                                    <td className="px-6 py-3 text-center font-bold text-indigo-600 bg-indigo-50/30 border-l border-indigo-100 group-hover:bg-indigo-100/30 transition-colors">
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

      {/* FOOTER LEGEND */}
      <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-6 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-green-100 text-green-600 flex items-center justify-center"><FaCheck size={10}/></span> Present
        </div>
        <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-yellow-100 text-yellow-600 flex items-center justify-center"><FaClock size={10}/></span> Leave
        </div>
        <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md flex items-center justify-center"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div></span> Absent
        </div>
      </div>

    </div>
  );
};

export default AttendanceTablePage;