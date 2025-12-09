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
  FaCheck,
  FaTimes,
  FaClock
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

  const filteredUsers = users.filter((u) => {
    const nameMatch = u?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const currentStatus = attendanceData[u._id] || "Pending"; 
    
    if (filter === "Pending") return nameMatch && !attendanceData[u._id];
    const statusMatch = filter === "All" || currentStatus === filter;
    return nameMatch && statusMatch;
  });

  const markAllPresent = () => {
    const updatedAttendance = { ...attendanceData };
    filteredUsers.forEach((user) => {
      updatedAttendance[user._id] = "Present"; 
    });
    setAttendanceData(updatedAttendance);
    toast.info("Marked visible users as Present");
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition">
                <FaArrowLeft />
            </button>
            <h1 className="text-xl font-extrabold text-gray-800">Daily Attendance</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 md:max-w-xs">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input type="date" value={selectedDate.toISOString().split("T")[0]} onChange={handleDateChange} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
            </div>
            <div className="relative flex-1 md:max-w-xs">
                <FaSearch className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>
            <div className="relative flex-1 md:max-w-[150px]">
                <FaFilter className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer">
                    <option value="All">All</option>
                    <option value="Present">Present</option>
                    <option value="Leave">Leave</option>
                    <option value="Absent">Absent</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>
            <div className="flex gap-2 w-full md:w-auto ml-auto">
                <button onClick={markAllPresent} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg hover:bg-blue-100 transition text-sm font-bold">
                    <FaCheckDouble /> Mark All
                </button>
                <button onClick={handleSubmitAttendance} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-bold shadow-md">
                    <FaSave /> Save
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- USER CARDS GRID --- */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
            <div className="text-center py-20 text-gray-500 animate-pulse">Loading...</div>
        ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No users found.</div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredUsers.map((user) => {
                    const status = attendanceData[user._id];
                    
                    // Dynamic Border Color based on status
                    let borderClass = "border-gray-200";
                    if(status === "Present") borderClass = "border-green-500 ring-2 ring-green-100";
                    if(status === "Absent") borderClass = "border-red-500 ring-2 ring-red-100";
                    if(status === "Leave") borderClass = "border-yellow-500 ring-2 ring-yellow-100";

                    return (
                        <div key={user._id} className={`bg-white rounded-xl shadow-sm border p-4 flex flex-col items-center transition-all hover:shadow-md ${borderClass}`}>
                            
                            {/* Photo & Name */}
                            <div className="flex flex-col items-center mb-4">
                                <img
                                    src={user.photo || "/user.png"}
                                    alt={user.name}
                                    onError={(e) => { e.target.src = "/user.png"; }}
                                    className={`w-20 h-20 rounded-full object-cover border-4 mb-2 ${
                                        status === "Present" ? "border-green-500" : 
                                        status === "Absent" ? "border-red-500" : 
                                        status === "Leave" ? "border-yellow-500" : "border-gray-100"
                                    }`}
                                />
                                <h3 className="text-sm font-bold text-gray-800 text-center leading-tight line-clamp-1">{user.name}</h3>
                            </div>

                            {/* Action Buttons (Icon Only for compactness) */}
                            <div className="flex gap-2 w-full justify-center">
                                {/* Present */}
                                <button
                                    onClick={() => handleAttendanceChange(user._id, "Present")}
                                    className={`p-2 rounded-lg transition-all shadow-sm ${status === "Present" ? "bg-green-600 text-white scale-110" : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"}`}
                                    title="Present"
                                >
                                    <FaCheck size={14} />
                                </button>

                                {/* Leave */}
                                <button
                                    onClick={() => handleAttendanceChange(user._id, "Leave")}
                                    className={`p-2 rounded-lg transition-all shadow-sm ${status === "Leave" ? "bg-yellow-500 text-white scale-110" : "bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600"}`}
                                    title="Leave"
                                >
                                    <FaClock size={14} />
                                </button>

                                {/* Absent */}
                                <button
                                    onClick={() => handleAttendanceChange(user._id, "Absent")}
                                    className={`p-2 rounded-lg transition-all shadow-sm ${status === "Absent" ? "bg-red-500 text-white scale-110" : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500"}`}
                                    title="Absent"
                                >
                                    <FaTimes size={14} />
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