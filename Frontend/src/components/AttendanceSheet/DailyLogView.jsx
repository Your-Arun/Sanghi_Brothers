import React, { useState, useEffect } from "react";
import axiosInstance from "../Dashboard/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaSearch, 
  FaCalendarAlt, 
  FaCheckDouble, 
  FaSave, 
  FaFilter,
  FaUserCheck,
  FaUserClock,
  FaUserTimes
} from "react-icons/fa";

const DailyLogView = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // --- API CALLS ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split("T")[0];
      try {
        const [userRes, attendanceRes] = await Promise.all([
          axiosInstance.get("/users"),
          axiosInstance.get(`/daily-attendance?date=${dateStr}`)
        ]);

        setUsers(userRes.data || []);

        const attendanceMap = {};
        (attendanceRes.data || []).forEach((entry) => {
          attendanceMap[entry._id] = entry.status;
        });
        setAttendanceData(attendanceMap);
      } catch (err) {
        console.error("Data fetch failed:", err);
        toast.error("⚠️ Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // --- HANDLERS ---
  const handleAttendanceChange = (userId, status) => {
    setAttendanceData((prev) => ({ ...prev, [userId]: status }));
  };

  const handleSubmitAttendance = async () => {
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const payload = Object.entries(attendanceData).map(([userId, status]) => ({
        userId,
        date: dateStr,
        status,
      }));
      await axiosInstance.post("/mark-attendance", payload);
      toast.success("Attendance submitted successfully! 🎉");
    } catch (err) {
      toast.error("Error submitting attendance.");
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const nameMatch = u?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const currentStatus = attendanceData[u._id] || "Pending"; 
    
    // Filter logic: If 'Pending' filter is selected, show users with no status
    if (filter === "Pending") return nameMatch && !attendanceData[u._id];
    
    const statusMatch = filter === "All" || currentStatus === filter;
    return nameMatch && statusMatch;
  });

  const markAllPresent = () => {
    const updatedAttendance = { ...attendanceData };
    filteredUsers.forEach((user) => {
      // Only mark if not already set (optional, or force overwrite)
      updatedAttendance[user._id] = "Present"; 
    });
    setAttendanceData(updatedAttendance);
    toast.info("Marked visible users as Present");
  };

  // Date Helper
  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- STICKY HEADER & CONTROLS --- */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          
          {/* Top Row: Title & Back */}
          <div className="flex items-center gap-3">
            <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
            >
                <FaArrowLeft />
            </button>
            <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                Daily Attendance
            </h1>
          </div>

          {/* Bottom Row: Controls */}
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Date */}
            <div className="relative flex-1 md:max-w-xs">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-700"
                />
            </div>

            {/* Search */}
            <div className="relative flex-1 md:max-w-xs">
                <FaSearch className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
            </div>

            {/* Filter */}
            <div className="relative flex-1 md:max-w-[150px]">
                <FaFilter className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer"
                >
                    <option value="All">All Status</option>
                    <option value="Present">Present</option>
                    <option value="Leave">Leave</option>
                    <option value="Absent">Absent</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full md:w-auto ml-auto">
                <button
                    onClick={markAllPresent}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg hover:bg-blue-100 transition text-sm font-bold"
                >
                    <FaCheckDouble /> Mark All Present
                </button>
                <button
                    onClick={handleSubmitAttendance}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-bold shadow-md hover:shadow-lg"
                >
                    <FaSave /> Save
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
            <div className="text-center py-20 text-gray-500">
                <p className="animate-pulse">Loading employees...</p>
            </div>
        ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-400 text-lg">No employees found matching filters.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map((user) => {
                    const currentStatus = attendanceData[user._id];

                    return (
                        <div 
                            key={user._id} 
                            className={`bg-white rounded-xl shadow-sm border p-5 transition-all duration-200 hover:shadow-md
                            ${currentStatus === "Absent" ? "border-red-100" : 
                              currentStatus === "Leave" ? "border-yellow-100" : 
                              currentStatus === "Present" ? "border-green-100" : "border-gray-200"}`}
                        >
                            {/* User Header */}
                            <div className="flex items-center gap-4 mb-5">
                                <img
                                    src={user.photo || "/user.png"}
                                    alt={user.name}
                                    onError={(e) => { e.target.src = "/user.png"; }}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide bg-gray-100 px-2 py-0.5 rounded w-fit mt-1">
                                        {user.designation || user.department || "Staff"}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons (Segmented Control) */}
                            <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                
                                {/* PRESENT */}
                                <button
                                    onClick={() => handleAttendanceChange(user._id, "Present")}
                                    className={`flex flex-col items-center justify-center py-2 rounded-md text-xs font-bold transition-all duration-200
                                        ${currentStatus === "Present" 
                                            ? "bg-white text-green-600 shadow-sm ring-1 ring-gray-200" 
                                            : "text-gray-400 hover:text-green-600 hover:bg-white/50"
                                        }`}
                                >
                                    <FaUserCheck size={16} className="mb-1"/>
                                    Present
                                </button>

                                {/* LEAVE */}
                                <button
                                    onClick={() => handleAttendanceChange(user._id, "Leave")}
                                    className={`flex flex-col items-center justify-center py-2 rounded-md text-xs font-bold transition-all duration-200
                                        ${currentStatus === "Leave" 
                                            ? "bg-white text-yellow-600 shadow-sm ring-1 ring-gray-200" 
                                            : "text-gray-400 hover:text-yellow-600 hover:bg-white/50"
                                        }`}
                                >
                                    <FaUserClock size={16} className="mb-1"/>
                                    Leave
                                </button>

                                {/* ABSENT */}
                                <button
                                    onClick={() => handleAttendanceChange(user._id, "Absent")}
                                    className={`flex flex-col items-center justify-center py-2 rounded-md text-xs font-bold transition-all duration-200
                                        ${currentStatus === "Absent" 
                                            ? "bg-white text-red-500 shadow-sm ring-1 ring-gray-200" 
                                            : "text-gray-400 hover:text-red-500 hover:bg-white/50"
                                        }`}
                                >
                                    <FaUserTimes size={16} className="mb-1"/>
                                    Absent
                                </button>
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

export default DailyLogView;