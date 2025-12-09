import React, { useEffect, useState, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../Dashboard/axiosInstance";
import UserContext from "../Home Page/UserContext";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaSyncAlt, 
  FaSortAmountDown, 
  FaSearch,
  FaUserPlus,
  FaCheck, 
  FaTimes, 
  FaExclamation,
  FaArrowLeft,
  FaUserTie
} from "react-icons/fa";

const AttendanceDashboard = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);

  // --- STATE ---
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("a-z");
  const [loading, setLoading] = useState(false);

  // --- DATE CALCULATIONS ---
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();
  const daysInMonth = new Date(year, month, 0).getDate();

  // --- API CALL ---
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

  // --- FILTER & SORT LOGIC ---
  const filteredData = attendanceData
    .filter((user) => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "a-z") return a.name.localeCompare(b.name);
      if (sortOption === "z-a") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- STICKY TOP BAR --- */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Top Row: Title & Add Button */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
                >
                    <FaArrowLeft />
                </button>
                <div>
                    <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                        <FaUserTie className="text-indigo-600" /> 
                        Attendance Manager
                    </h1>
                    <p className="text-xs text-gray-500">
                        {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
                {currentUser?.department === "manager" && (
                    <button
                    onClick={() => navigate("/create-user")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
                    >
                    <FaUserPlus /> Add User
                    </button>
                )}
                <button
                    onClick={() => navigate("/daily-log-view")}
                    className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                    Daily Logs
                </button>
            </div>
          </div>

          {/* Bottom Row: Filters (Date, Search, Sort) */}
          <div className="flex flex-col md:flex-row gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            
            {/* Date Picker */}
            <div className="relative flex-1">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-700 cursor-pointer"
                />
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input 
                    type="text" 
                    placeholder="Search employee..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
            </div>

            {/* Sort & Refresh */}
            <div className="flex gap-2">
                <div className="relative w-32">
                    <FaSortAmountDown className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer"
                    >
                        <option value="a-z">A - Z</option>
                        <option value="z-a">Z - A</option>
                    </select>
                </div>
                <button
                    onClick={fetchMonthlyAttendance}
                    className="px-4 bg-white border border-gray-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                >
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <FaSyncAlt className="animate-spin text-3xl mb-3 text-indigo-400" />
                <p>Loading records...</p>
            </div>
        ) : filteredData.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-400 text-lg">No records found matching your filters.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredData.map((user) => {
                // Calculate stats per user
                let presentCount = 0;
                let leaveCount = 0;
                
                // Create days array for calendar grid
                const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
                    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                    const status = user.attendance[dateKey];
                    
                    if (status === "Present") presentCount++;
                    else if (status === "Leave") leaveCount++;

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
                        <h3 className="font-bold text-gray-800 text-lg leading-tight truncate max-w-[120px]">{user.name}</h3>
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded capitalize">
                            {user.department || "Staff"}
                        </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-indigo-600">{presentCount}</span>
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Present</span>
                    </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['S','M','T','W','T','F','S'].map((d, i) => (
                            <div key={i} className="text-center text-[10px] font-bold text-gray-400">{d}</div>
                        ))}
                        
                        {daysArray.map(({ day, status }) => {
                            let bgClass = "bg-gray-50 text-gray-300"; // Default Absent
                            let icon = null;

                            if (status === "Present") {
                                bgClass = "bg-green-100 text-green-600 border border-green-200";
                                icon = <FaCheck size={8} />;
                            } else if (status === "Leave") {
                                bgClass = "bg-yellow-100 text-yellow-600 border border-yellow-200";
                                icon = <FaExclamation size={8} />;
                            } else {
                                // Absent
                                bgClass = "bg-red-50 text-red-300 border border-red-100";
                                icon = <FaTimes size={8} />;
                            }

                            return (
                                <div 
                                    key={day} 
                                    className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs font-bold transition-all ${bgClass}`}
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
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Present
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div> Leave ({leaveCount})
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div> Absent
                        </div>
                    </div>
                </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;