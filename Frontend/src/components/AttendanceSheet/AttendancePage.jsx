import React, { useContext, useState, useEffect } from "react";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import UserContext from "../Home Page/UserContext";
import AttendanceTablePage from "./AttendanceTablePage";
import axiosInstance from "../Dashboard/axiosInstance";
import { 
  FaSearch, 
  FaUserPlus, 
  FaSyncAlt, 
  FaCalendarAlt, 
  FaSortAmountDown, 
  FaArrowLeft, 
  FaChevronLeft, 
  FaChevronRight 
} from "react-icons/fa";

const AttendancePage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);

  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [attendanceTableData, setAttendanceTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedUser, setSelectedUser] = useState(null);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // Date State
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // Pagination
  const [page, setPage] = useState(1);
  const usersPerPage = 6;

  // --- API CALLS ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get(
        `/users/attendance?month=${month}&year=${year}`
      );
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAttendance = async () => {
    setLoadingAttendance(true);
    try {
      const dateString = `${year}-${String(month).padStart(2, "0")}`;
      const res = await axiosInstance.get(
        `/daily-attendance?date=${dateString}`
      );
      setAttendanceTableData(res.data || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAttendance();
  }, [month, year]);

  // --- LOGIC ---
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "name-asc") return a.name?.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name?.localeCompare(a.name);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const filteredUsers = sortedUsers.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (page - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Fillers to keep grid shape
  const displayedUsers = [
    ...paginatedUsers,
    ...Array.from(
      { length: Math.max(0, usersPerPage - paginatedUsers.length) },
      () => null
    ),
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
            >
                <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Attendance Manager</h1>
              <p className="text-xs text-gray-500">Manage users and track logs</p>
            </div>
          </div>

          {currentUser?.department === "manager" && (
            <button
              onClick={() => navigate("/create-user")}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg active:scale-95"
            >
              <FaUserPlus /> <span className="hidden sm:inline">Add User</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* --- CONTROLS TOOLBAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          
          {/* Left: Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full sm:w-64">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative w-full sm:w-48">
               <FaSortAmountDown className="absolute left-3 top-3.5 text-gray-400" />
               <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => { fetchUsers(); fetchAttendance(); }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition text-sm font-medium"
            >
              <FaSyncAlt className={loadingUsers ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={() => navigate("/daily-log-view")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
            >
              <FaCalendarAlt /> Daily Logs
            </button>
          </div>
        </div>

        {/* --- USER GRID --- */}
        <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 pl-1">Employee Directory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingUsers ? (
                // SKELETON LOADER
                Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                ))
            ) : displayedUsers.length > 0 ? (
                displayedUsers.map((user, idx) =>
                user ? (
                    <div
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className="group bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all duration-200 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <img
                            src={user.photo || "/user-avatar.png"}
                            alt="User"
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-indigo-500 transition-colors"
                            />
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</h3>
                                <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wide mt-1">
                                    {user.department || "Staff"}
                                </span>
                                <p className="text-xs text-gray-400 mt-1 truncate max-w-[150px]">{user.email}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // INVISIBLE PLACEHOLDER FOR GRID ALIGNMENT
                    <div key={idx} className="invisible h-28"></div>
                )
                )
            ) : (
                <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                    No users found matching "{searchTerm}"
                </div>
            )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <FaChevronLeft />
                    </button>
                    <span className="text-sm font-medium text-gray-600">
                        Page <span className="text-indigo-600 font-bold">{page}</span> of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}
        </div>

        {/* --- ATTENDANCE TABLE SECTION --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Monthly Attendance Report</h2>
                <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded border border-gray-200 shadow-sm">
                    {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
            </div>
            <div className="p-1">
                <AttendanceTablePage
                    data={attendanceTableData}
                    loading={loadingAttendance}
                />
            </div>
        </div>

      </div>

      {/* --- PROFILE MODAL --- */}
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdated={() => {
            fetchUsers();
            fetchAttendance();
          }}
        />
      )}
    </div>
  );
};

export default AttendancePage;